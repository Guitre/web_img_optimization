import { setTaskFailed } from '../src/services/task.service'
import Task from '../src/models/task.model'
describe('setTaskFailed', () => {
  it('deve marcar a tarefa como FALHA e salvar a mensagem de erro', async () => {
    const save = jest.fn()
    const findOne = jest.spyOn(Task, 'findOne').mockResolvedValue({
      status: 'PENDING',
      processedAt: undefined,
      errorMessage: undefined,
      save,
    } as any)
    const error = new Error('fail')
    await setTaskFailed('id', error)
    expect(findOne).toHaveBeenCalledWith({ taskId: 'id' })
    expect(save).toHaveBeenCalled()
  })
  it('não deve fazer nada se a tarefa não for encontrada', async () => {
    jest.spyOn(Task, 'findOne').mockResolvedValue(null)
    const error = new Error('fail')
    await expect(setTaskFailed('id', error)).resolves.toBeUndefined()
  })
})
