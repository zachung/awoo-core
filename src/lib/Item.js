import ItemData from './ItemData'

const ChunkSize = 32

/**
 * @property {Chunk} chunk
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 */
class Item {
  /**
   *
   * @param {ItemData} data
   */
  constructor (data) {
    const { type, id, x, y, props } = data
    this.type = type
    this.id = id
    this.chunk = undefined
    this.props = props || {}
    if (x !== undefined) {
      this.setLocalPosition(x, y)
    }
  }

  setLocalPosition (x, y) {
    this.x = x
    this.y = y
  }

  get globalX () {
    return this.chunk.offsetX * ChunkSize + this.x
  }

  get globalY () {
    return this.chunk.offsetY * ChunkSize + this.y
  }

  removeSelf () {
    this.chunk.removeItem(this.x, this.y)
  }

  /**
   *
   * @param {Chunk} chunk
   */
  setIn (chunk) {
    chunk.addItem(this)
  }

  toData () {
    return {
      type: this.type,
      id: this.id,
      x: this.x,
      y: this.y,
      props: this.props,
      chunkName: this.chunk ? this.chunk.chunkName : undefined
    }
  }

  /**
   * @param {ItemData} data
   * @returns {Item}
   */
  static fromData (data) {
    return new Item(data)
  }
}

export default Item
