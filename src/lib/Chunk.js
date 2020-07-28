import Item from './Item'
import Layer from './Layer'
import ChunkReader from './ChunkReader'

const newItem = (symbol, x, y) => {
  const item = new Item(symbol)
  item.setLocalPosition(x, y)
  return item
}

const N = 32

/**
 * 32*32 blocks
 * @property {Stage} stage
 */
class Chunk {
  constructor (offsetX, offsetY) {
    const groundLayer = new Layer(N)
    const itemLayer = new Layer(N)

    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        const empty = newItem('', x, y)
        empty.chunk = this
        groundLayer.put(empty, x, y)
      }
    }

    this.chunkName = Chunk.getChunkName(offsetX, offsetY)
    this.groundLayer = groundLayer
    this.itemLayer = itemLayer
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  setStage (stage) {
    this.stage = stage
  }

  loadWorld () {
    const worldReader = new ChunkReader()
    return worldReader.load(this.chunkName, item => this.addItem(item))
  }

  getItemByGlobalLoc (x, y) {
    return this.getItem(x, y)
  }

  getItem (offsetX, offsetY) {
    let item = undefined
    ;[this.itemLayer, this.groundLayer].some(layer => {
      item = layer.getItem(offsetX, offsetY)
      if (item) {
        return true
      }
    })
    return item
  }

  addItem (item, x, y) {
    x = x !== undefined ? x : item.x
    y = y !== undefined ? y : item.y
    this.itemLayer.put(item, x, y)
    item.chunk = this
  }

  removeItem (item, x, y) {
    this.itemLayer.remove(item, x, y)
  }

  move (item, x, y) {
    return this.stage.move(this, item, x, y)
  }

  static getChunkName (offsetX, offsetY) {
    const WE = offsetX >= 0 ? 'E' : 'W'
    const NS = offsetY < 0 ? 'N' : 'S'
    return Math.abs(offsetX) + WE + Math.abs(offsetY) + NS
  }
}

export default Chunk
