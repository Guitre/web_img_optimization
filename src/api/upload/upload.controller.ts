import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getChannel } from '../../config/rabbitmq';
import Task from '../../models/task.model';
import sharp from 'sharp';

export async function uploadController(req: Request, res: Response) {
  const file = req.file;
  if (!file) {
    res.status(400).json({ error: 'Nenhum arquivo foi enviado.' });
    return;
  }
  const taskId = uuidv4();
  let originalMetadata;
  try {
    const image = sharp(file.buffer);
    const metadata = await image.metadata();
    originalMetadata = {
      width: metadata.width || 0,
      height: metadata.height || 0,
      mimetype: file.mimetype,
      exif: metadata.exif || {},
    };
  } catch (err) {
    res.status(400).json({ error: 'Não foi possível ler os metadados da imagem.' });
    return;
  }
  const task = new Task({
    taskId,
    originalFilename: file.originalname,
    status: 'PENDING',
    originalMetadata,
    versions: [],
  });
  await task.save();
  const channel = getChannel();
  channel.sendToQueue('image_processing', file.buffer, {
    headers: { taskId }
  });
  res.status(202).json({ taskId, status: 'PENDING' });
}
