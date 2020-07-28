const ChunkSize = 32
const round = p => ((p % ChunkSize) + ChunkSize) % ChunkSize

/**
 * @property {Chunk} chunk
 * @property {string} symbol 顯示符號
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 */
class Item {
  constructor (symbol) {
    this.chunk = undefined
    this.symbol = symbol
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
      .catch(err => {
        console.log(err.message)
      })
  }
}

export default Item
