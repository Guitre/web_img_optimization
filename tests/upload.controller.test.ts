import { uploadController } from '../src/api/upload/upload.controller'
import { Request, Response } from 'express'
import Task from '../src/models/task.model'
describe('Controlador de upload', () => {
  it('deve retornar 400 se nenhum arquivo for enviado', async () => {
    const req = { file: undefined } as unknown as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any
    await uploadController(req, res)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({ error: expect.any(String) })
  })
  it('deve criar uma tarefa e retornar 202', async () => {
    const req = { file: { mimetype: 'image/jpeg', originalname: 'a', buffer: Buffer.from('') } } as unknown as Request
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any
    jest.spyOn(Task.prototype, 'save').mockResolvedValue(undefined as any)
    jest.spyOn(Task, 'findOne').mockResolvedValue(null)
    const channel = { sendToQueue: jest.fn() }
    jest.spyOn(require('../src/config/rabbitmq'), 'getChannel').mockReturnValue(channel)
    await uploadController(req, res)
    expect(res.status).toHaveBeenCalledWith(202)
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ taskId: expect.any(String), status: 'PENDING' }))
  })
})
