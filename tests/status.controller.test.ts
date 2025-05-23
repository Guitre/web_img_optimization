import { statusController } from '../src/api/status/status.controller'
import { Request, Response } from 'express'
import Task from '../src/models/task.model'
describe('Controlador de status', () => {
  it('deve retornar 404 se não encontrar', async () => {
    const req = { params: { taskId: 'id' } } as unknown as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any
    jest.spyOn(Task, 'findOne').mockResolvedValue(null)
    await statusController(req, res)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) })
  })
  it('deve retornar 200 e os dados da tarefa se encontrada', async () => {
    const req = { params: { taskId: 'id' } } as unknown as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any
    const task = { taskId: 'id', status: 'COMPLETED', processedAt: new Date(), errorMessage: '', versions: [], originalFilename: 'a', originalMetadata: {} }
    jest.spyOn(Task, 'findOne').mockResolvedValue(task)
    await statusController(req, res)
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ taskId: 'id' }))
  })
})
