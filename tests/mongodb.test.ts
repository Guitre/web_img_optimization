import { connectMongoDB } from '../src/config/mongodb'
describe('connectMongoDB', () => {
  it('deve conectar usando a url do .env', async () => {
    await expect(connectMongoDB()).resolves.toBeUndefined()
  })
})
