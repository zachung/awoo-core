const { Chunk, Item, Layer, ItemData, ChunkReader } = require('../src/index')

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
    if (!ItemData) {
      throw new Error('ItemData 載入失敗')
    }
    if (!ChunkReader) {
      throw new Error('ChunkReader 載入失敗')
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
    let item = new Item({ type: 1, id: 1, x: 0, y: 15, props: { a: 'foo' } })
    let chunk = new Chunk(0, 0)
    let [key, chunkName, x, y, props] = item.toData()
    if (key !== '1:1' || x !== 0 || y !== 15 || chunkName !== undefined || props.a !== 'foo') {
      throw new Error('Item 解構失敗')
    }
    item.chunk = chunk
    let [, newChunkName] = item.toData()
    if (newChunkName !== '0E0S') {
      throw new Error('Item chunkName 解構失敗')
    }
    const newItem = Item.fromData(item.toData())
    if (newItem.type !== 1 || newItem.id !== 1 || newItem.x !== 0 || newItem.y !== 15) {
      throw new Error('Item 重建失敗')
    }
    const airItem = Item.fromData(['0:0', '', 14, 14, {}])
    if (airItem.type !== 0 || airItem.id !== 0 || airItem.x !== 14 || airItem.y !== 14) {
      throw new Error('Item 重建失敗')
    }
    [key, , x, y] = new Item({ type: 0, id: 1, x: 0, y: 15 }).toData()
    if (key !== '0:1' || x !== 0 || y !== 15) {
      console.log(key, x, y)
      throw new Error('Item type 0 解構失敗')
    }
  })
})

describe('測試 ItemData', () => {
  it('ItemData', () => {
    const itemData = new ItemData(['2:0', '0E0S', 5, 16, { name: 'hello' }])
    if (itemData.key !== '2:0' || itemData.x !== 5 || itemData.y !== 16 || itemData.chunkName !== '0E0S' || itemData.props.name !== 'hello') {
      throw new Error('ItemData 取值失敗')
    }
  })
})
