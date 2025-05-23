import { Request, Response } from 'express';
import Task from '../../models/task.model';

export async function statusController(req: Request, res: Response) {
  const { taskId } = req.params;
  const task = await Task.findOne({ taskId });
  if (!task) {
    res.status(404).json({ error: 'Tarefa não encontrada.' });
    return;
  }
  res.status(200).json({
    taskId: task.taskId,
    status: task.status,
    processedAt: task.processedAt,
    errorMessage: task.errorMessage,
    versions: task.versions,
    originalFilename: task.originalFilename,
    originalMetadata: task.originalMetadata
  });
}
