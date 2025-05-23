import amqp from 'amqplib';
import logger from '../utils/logger';

let channel: any;
let connection: any;

async function waitForRabbitMQ(url: string, retries = 15, delay = 4000): Promise<void> {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect(url);
      const ch = await conn.createChannel();
      connection = conn;
      channel = ch;
      logger.info('Conectado ao RabbitMQ com sucesso');
      return;
    } catch (error) {
      logger.error(`Tentativa ${i + 1} de conectar ao RabbitMQ falhou:`, error);
      if (i < retries - 1) {
        await new Promise(res => setTimeout(res, delay));
      } else {
        throw error;
      }
    }
  }
}

export async function connectRabbitMQ(): Promise<void> {
  const url = process.env.RABBITMQ_URL || 'amqp://localhost';
  await waitForRabbitMQ(url);
}

export function getChannel(): any {
  if (!channel) {
    throw new Error('RabbitMQ não está conectado');
  }
  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  if (channel) {
    await channel.close();
    channel = undefined;
  }
  if (connection) {
    await connection.close();
    connection = undefined;
  }
}