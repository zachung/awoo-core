const ChunkSize = 32
const round = p => ((p % ChunkSize) + ChunkSize) % ChunkSize

/**
 * @property {Chunk} chunk
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 */
class Item {
  constructor ({ type, id, x, y }) {
    this.type = type
    this.id = id
    this.chunk = undefined
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

  move (x, y) {
    return this.chunk
      .move(this, x, y)
      .then(() => {
        this.setLocalPosition(round(x), round(y))
      })
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
}

export default Item
