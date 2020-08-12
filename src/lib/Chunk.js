import Layer from './Layer'
import ChunkReader from './ChunkReader'
import Item from './Item'

const N = 32

const initGroupLayer = chunk => {
  const groundLayer = new Layer(N)
  for (let x = 0; x < N; x++) {
    for (let y = 0; y < N; y++) {
      const empty = Item.fromData(['0:0', '', x, y, {}])
      empty.chunk = chunk
      groundLayer.put(empty, x, y)
    }
  }
  return groundLayer
}

/**
 * 32*32 blocks
 * @property {Layer} groundLayer
 * @property {Layer} itemLayer
 */
class Chunk {
  constructor (offsetX, offsetY) {
    this.chunkName = Chunk.getChunkName(offsetX, offsetY)
    this.groundLayer = initGroupLayer(this)
    this.itemLayer = new Layer(N)
    this.offsetX = offsetX
    this.offsetY = offsetY
  }

  static offset (chunkName) {
    const re = /(\d+)(\w)(\d+)(\w)/
    let [, offsetX, xd, offsetY, yd] = chunkName.match(re)
    return {
      offsetX: parseInt(xd === 'W' ? -offsetX : offsetX),
      offsetY: parseInt(yd === 'N' ? -offsetY : offsetY)
    }
  }

  static fromName (chunkName) {
    const { offsetX, offsetY } = Chunk.offset(chunkName)
    return new Chunk(offsetX, offsetY)
  }

  /**
   * @param {ChunkReader} reader
   * @returns {PromiseLike<any> | Promise<any>}
   */
  loadWorld (reader) {
    return reader
      .load(this.chunkName, (layer, item) => {
        if (layer === 'grounds') {
          item.chunk = this
          this.groundLayer.remove(item.x, item.y)
          this.groundLayer.put(item, item.x, item.y)
          return
        }
        this.addItem(item)
      })
      .then(() => {
        // 初始載入不需要關注
        this.itemLayer.isDirty = false
      })
  }

  getItem (offsetX, offsetY) {
    let item = undefined;
    [this.itemLayer, this.groundLayer].some(layer => {
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
    this.itemLayer.isDirty = true
    item.chunk = this
  }

  removeItem (x, y) {
    const removed = this.itemLayer.remove(x, y)
    if (removed !== undefined) {
      this.itemLayer.isDirty = true
    }
  }

  static getChunkName (offsetX, offsetY) {
    const WE = offsetX >= 0 ? 'E' : 'W'
    const NS = offsetY < 0 ? 'N' : 'S'
    return Math.abs(offsetX) + WE + Math.abs(offsetY) + NS
  }

  get isDirty () {
    // 目前只有 itemLayer 會變動
    return this.itemLayer.isDirty
  }

  set isDirty (isDirty) {
    this.itemLayer.isDirty = isDirty
  }

  export () {
    if (this.isDirty || !this._worldExportCache) {
      const grounds = this.groundLayer.export()
      const items = this.itemLayer.export()
      this._worldExportCache = { grounds, items }
    }
    return this._worldExportCache
  }
}

export default Chunk
