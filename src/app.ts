import express from 'express';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './config/rabbitmq';
import { connectMongoDB } from './config/mongodb';
import logger from './utils/logger';
import uploadRoutes from './api/upload/upload.routes';
import statusRoutes from './api/status/status.routes';

dotenv.config();

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/api', uploadRoutes);
  app.use('/api/status', statusRoutes);
  return app;
}

const app = createApp();
const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  try {
    await connectRabbitMQ();
    await connectMongoDB();
    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    logger.error('Erro ao iniciar o servidor:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}