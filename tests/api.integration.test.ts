import request from 'supertest'
import express from 'express'
import { connectMongoDB } from '../src/config/mongodb'
import { connectRabbitMQ, closeRabbitMQ } from '../src/config/rabbitmq'
import Task from '../src/models/task.model'
import { createApp } from '../src/app'
import logger from '../src/utils/logger';
import mongoose from 'mongoose';

describe('Integração da API', () => {
  let app: express.Express

  beforeAll(async () => {
    process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/image_optimization_test';
    process.env.NODE_ENV = 'test';
    process.env.LOG_LEVEL = 'silent';
    await connectMongoDB();
    await connectRabbitMQ();
    app = createApp();
  })

  afterAll(async () => {
    jest.restoreAllMocks();
    await Task.deleteMany({})
    await mongoose.connection.close();
    try {
      await closeRabbitMQ();
    } catch (e) {
    }
  })

  it('deve retornar 400 se nenhum arquivo for enviado', async () => {
    const res = await request(app).post('/api/upload').send()
    expect(res.status).toBe(400)
    expect(res.body.error).toBeDefined()
  })

  it('deve criar uma tarefa e retornar taskId', async () => {
    const res = await request(app)
      .post('/api/upload')
      .attach('file', Buffer.from('test'), 'test.jpg')
    expect(res.status).toBe(202)
    expect(res.body.taskId).toBeDefined()
    expect(res.body.status).toBe('PENDING')
  })

  it('deve retornar 404 para tarefa inexistente', async () => {
    const res = await request(app).get('/api/status/invalid-task-id')
    expect(res.status).toBe(404)
    expect(res.text).toContain('error')
    expect(res.text).toContain('Tarefa não encontrada')
  })
})
