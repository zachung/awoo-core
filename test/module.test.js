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
    if (chunk.offsetX !== 0 && chunk.offsetY !== 0 || chunk.chunkName !== '0E0S') {
      throw new Error('Chunk 從名稱 0E0S 載入失敗')
    }
    chunk = Chunk.fromName('1E1S')
    if (chunk.offsetX !== 1 || chunk.offsetY !== 1 || chunk.chunkName !== '1E1S') {
      throw new Error('Chunk 從名稱 1E1S 載入失敗')
    }
    chunk = Chunk.fromName('1W1N')
    if (chunk.offsetX !== -1 && chunk.offsetY !== -1 || chunk.chunkName !== '1W1N') {
      throw new Error('Chunk 從名稱 1W1N 載入失敗')
    }
    chunk = Chunk.fromName('1W1S')
    if (chunk.offsetX !== -1 && chunk.offsetY !== 1 || chunk.chunkName !== '1W1S') {
      throw new Error('Chunk 從名稱 1W1S 載入失敗')
    }
  })
})

describe('測試 Item', () => {
  it('建構&解構', () => {
    const item = new Item({ type: 1, id: 1, x: 0, y: 15 })
    const chunk = new Chunk(0, 0)
    let { type, id, x, y, chunkName } = item.toData()
    if (type !== 1 || id !== 1 || x !== 0 || y !== 15 || chunkName !== undefined) {
      throw new Error('Item 解構失敗')
    }
    item.chunk = chunk
    let { chunkName: newChunkName } = item.toData()
    if (newChunkName !== '0E0S') {
      throw new Error('Item chunkName 解構失敗')
    }
    const newItem = Item.fromData(item.toData())
    if (newItem.type !== 1 || newItem.id !== 1 || newItem.x !== 0 || newItem.y !== 15) {
      throw new Error('Item 建構失敗')
    }
  })
})
