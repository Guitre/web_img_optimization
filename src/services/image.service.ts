import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import Task from '../models/task.model';

const OUTPUT_DIR = path.resolve(__dirname, '../../processed_images');

export function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

export async function processImageTask(taskId: string, buffer: Buffer) {
  const task = await Task.findOne({ taskId });
  if (!task) throw new Error(`Tarefa com taskId ${taskId} não encontrada.`);
  task.status = 'PROCESSING';
  await task.save();

  const image = sharp(buffer);
  const originalMetadata = await image.metadata();
  const originalWidth = originalMetadata.width || 0;
  const originalHeight = originalMetadata.height || 0;

  const versions = [
    { quality: 'low', width: 320, height: originalWidth && originalHeight ? Math.round(320 * originalHeight / originalWidth) : null, q: 50 },
    { quality: 'medium', width: 800, height: originalWidth && originalHeight ? Math.round(800 * originalHeight / originalWidth) : null, q: 80 },
    { quality: 'high', width: originalWidth, height: originalHeight, q: 80 },
  ];

  for (const version of versions) {
    const resizeOptions = version.width && version.height ? { width: version.width, height: version.height } : {};
    const outputPath = path.join(OUTPUT_DIR, `${taskId}_${version.quality}.webp`);
    await sharp(buffer).resize(resizeOptions).webp({ quality: version.q }).toFile(outputPath);
    const metadata = await sharp(outputPath).metadata();
    task.versions.push({
      quality: version.quality as 'low' | 'medium' | 'high',
      path: outputPath,
      width: metadata.width || 0,
      height: metadata.height || 0,
      size: metadata.size || 0,
    });
  }

  task.status = 'COMPLETED';
  task.processedAt = new Date();
  await task.save();
}
