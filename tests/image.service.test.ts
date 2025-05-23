import { processImageTask, ensureOutputDir } from '../src/services/image.service'
import Task from '../src/models/task.model'
import fs from 'fs'
describe('ensureOutputDir', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  it('deve criar o diretório de saída se não existir', () => {
    const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(false)
    const mkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)
    ensureOutputDir()
    expect(existsSync).toHaveBeenCalled()
    expect(mkdirSync).toHaveBeenCalled()
  })
  it('não deve criar o diretório de saída se já existir', () => {
    const existsSync = jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    const mkdirSync = jest.spyOn(fs, 'mkdirSync').mockImplementation(() => undefined)
    ensureOutputDir()
    expect(mkdirSync).not.toHaveBeenCalled()
  })
})
describe('processImageTask', () => {
  it('deve lançar erro se a tarefa não for encontrada', async () => {
    jest.spyOn(Task, 'findOne').mockResolvedValue(null)
    await expect(processImageTask('id', Buffer.from(''))).rejects.toThrow()
  })
})
