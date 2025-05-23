import mongoose from 'mongoose';
import logger from '../utils/logger';

export async function connectMongoDB(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/image_optimization';
  try {
    await mongoose.connect(mongoURI);
    logger.info('Conectado ao MongoDB com sucesso');
  } catch (error) {
    logger.error('Erro ao conectar ao MongoDB:', error);
    throw error;
  }
}