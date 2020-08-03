const { Chunk, Item, Layer } = require('../src/index')

describe('測試模組載入', () => {
  it('各項載入', () => {
    if (!Chunk) {
      throw new Error('Chunk 載入失敗')
    }
    if (!Item) {
      throw new Error('Item 載入失敗')
    }
    if (!Layer) {
      throw new Error('Layer 載入失敗')
    }
  })
  it('chunk load', () => {
    let chunk = Chunk.fromName('0E0S')
    if (chunk.offsetX !== 0 && chunk.offsetY !== 0) {
      console.log(chunk.offsetX, chunk.offsetY)
      throw new Error('Chunk 從名稱 0E0S 載入失敗')
    }
    chunk = Chunk.fromName('1E1S')
    if (chunk.offsetX !== 1 && chunk.offsetY !== -1) {
      throw new Error('Chunk 從名稱 1E1S 載入失敗')
    }
    chunk = Chunk.fromName('1W1N')
    if (chunk.offsetX !== -1 && chunk.offsetY !== 1) {
      throw new Error('Chunk 從名稱 1W1N 載入失敗')
    }
    chunk = Chunk.fromName('1W1S')
    if (chunk.offsetX !== -1 && chunk.offsetY !== -1) {
      throw new Error('Chunk 從名稱 1W1S 載入失敗')
    }
  })
})
