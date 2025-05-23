import { getChannel, connectRabbitMQ } from '../config/rabbitmq';
import { connectMongoDB } from '../config/mongodb';
import logger from '../utils/logger';
import { processImageTask, ensureOutputDir } from '../services/image.service';
import { setTaskFailed } from '../services/task.service';

export async function startImageProcessor(): Promise<void> {
  if (process.env.NODE_ENV === 'test' || process.env.LOG_LEVEL === 'silent') {
    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'error').mockImplementation(() => {});
    jest.spyOn(logger, 'warn').mockImplementation(() => {});
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
  }

  ensureOutputDir();
  await connectRabbitMQ();
  const channel = getChannel();
  const queue = 'image_processing';
  await channel.assertQueue(queue, { durable: true });
  logger.info(`Worker escutando a fila: ${queue}`);

  channel.consume(queue, async (msg: any) => {
    if (!msg) return;
    const taskId = msg.properties.headers?.taskId;
    if (!taskId) {
      logger.error('Mensagem recebida sem taskId no header. Ignorando.');
      channel.nack(msg, false, false);
      return;
    }

    const buffer = msg.content;
    logger.info(`Mensagem recebida para taskId: ${taskId}`);

    try {
      await processImageTask(taskId, buffer);
      logger.info(`Processamento concluído para taskId: ${taskId}`);
      channel.ack(msg);
    } catch (error) {
      logger.error(`Erro ao processar taskId ${taskId}: ${error instanceof Error ? error.message : String(error)}`);
      if (error instanceof Error) logger.error(error.stack || '');
      channel.nack(msg, false, true);
      if (taskId && error instanceof Error) {
        await setTaskFailed(taskId, error);
      }
    }
  });
}

async function bootstrap() {
  await connectMongoDB();
  await startImageProcessor();
}

bootstrap();