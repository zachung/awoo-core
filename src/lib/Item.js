import ItemData from './ItemData'
import Chunk from './Chunk'

const ChunkSize = 32

/**
 * @property {number} type
 * @property {number} id
 * @property {string} chunkName
 * @property {Chunk} chunk
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 * @property {Object} props 屬性
 */
class Item {
  constructor (data) {
    const { type, id, x, y, chunkName, props } = data
    this.type = type
    this.id = id
    this.chunkName = chunkName
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

  get chunkOffsetX () {
    if (this.chunk) {
      return this.chunk.offsetX
    }
    const { offsetX } = Chunk.offset(this.chunkName)
    return offsetX
  }

  get chunkOffsetY () {
    if (this.chunk) {
      return this.chunk.offsetY
    }
    const { offsetY } = Chunk.offset(this.chunkName)
    return offsetY
  }

  get globalX () {
    return this.chunkOffsetX * ChunkSize + this.x
  }

  get globalY () {
    return this.chunkOffsetY * ChunkSize + this.y
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

  /**
   * @return {ItemData}
   */
  toData () {
    return ItemData.toJson(this)
  }

  /**
   * @returns {Item}
   */
  static fromData (data) {
    return ItemData.fromJson(data)
  }
}

export default Item
