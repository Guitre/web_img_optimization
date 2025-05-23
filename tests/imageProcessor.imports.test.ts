import { getChannel } from '../src/config/rabbitmq'
import { connectMongoDB } from '../src/config/mongodb'
import logger from '../src/utils/logger'
import { processImageTask, ensureOutputDir } from '../src/services/image.service'
import { setTaskFailed } from '../src/services/task.service'
describe('imageProcessor', () => {
  it('deve importar todas as dependências', () => {
    expect(getChannel).toBeDefined()
    expect(connectMongoDB).toBeDefined()
    expect(logger).toBeDefined()
    expect(processImageTask).toBeDefined()
    expect(ensureOutputDir).toBeDefined()
    expect(setTaskFailed).toBeDefined()
  })
})
