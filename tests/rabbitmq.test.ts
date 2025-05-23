import { connectRabbitMQ } from '../src/config/rabbitmq'
describe('connectRabbitMQ', () => {
  it('deve conectar usando a url do .env', async () => {
    await expect(connectRabbitMQ()).resolves.toBeUndefined()
  })
})
