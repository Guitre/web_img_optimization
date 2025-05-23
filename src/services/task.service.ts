import Task from '../models/task.model';

export async function setTaskFailed(taskId: string, error: Error) {
  const failedTask = await Task.findOne({ taskId });
  if (failedTask) {
    failedTask.status = 'FAILED';
    failedTask.processedAt = new Date();
    failedTask.errorMessage = error.stack || error.message;
    await failedTask.save();
  }
}
