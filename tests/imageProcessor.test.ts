import { startImageProcessor } from '../src/workers/imageProcessor'
describe('startImageProcessor', () => {
  it('deve ser uma função', () => {
    expect(typeof startImageProcessor).toBe('function')
  })
})
