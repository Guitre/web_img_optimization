import Task from '../src/models/task.model'
describe('Modelo de Tarefa', () => {
  it('deve possuir os campos obrigatórios', () => {
    const task = new Task({
      taskId: 'id',
      originalFilename: 'file.jpg',
      status: 'PENDING',
      originalMetadata: { width: 1, height: 1, mimetype: 'image/jpeg' },
      versions: []
    })
    expect(task.taskId).toBe('id')
    expect(task.status).toBe('PENDING')
    expect(task.originalFilename).toBe('file.jpg')
    expect(task.originalMetadata).toBeDefined()
    expect(task.versions).toEqual([])
  })
})
