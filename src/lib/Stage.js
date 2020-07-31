import Chunk from './Chunk'

const chunkLoc = (x, y) => {
  return x.toString() + '_' + y.toString()
}

const ChunkSize = 32
const round = p => ((p % ChunkSize) + ChunkSize) % ChunkSize
const chunkOffset = p => Math.floor(p / ChunkSize)

/**
 * @property {Number} viewSize
 * @property {Object} cameraDelta 鏡頭偏移(距離左上角距離)
 * @preserve {ChunkReader} chunkReader
 */
class Stage {
  constructor ({ viewSize, cameraDelta, chunkReader }) {
    this.loading = false
    this.chunks = {}
    this.chunkReader = chunkReader

    this.map = []
    // init fallback
    for (let x = 0; x < viewSize; x++) {
      this.map[x] = []
      for (let y = 0; y < viewSize; y++) {
        this.map[x][y] = undefined
      }
    }
    this.viewSize = viewSize
    this.cameraDelta = cameraDelta
  }

  get chunk () {
    return this.chunks[this.curChunkInx]
  }

  addChunk (chunk) {
    this.chunks[chunkLoc(chunk.offsetX, chunk.offsetY)] = chunk
    chunk.setStage(this)
  }

  cameraGoTo (x, y) {
    this.cameraAt = { x, y }
    x -= this.cameraDelta.x
    y -= this.cameraDelta.y
    return this.changeChunk(x, y).then(() => {
      for (let mapX = 0; mapX < this.viewSize; mapX++) {
        for (let mapY = 0; mapY < this.viewSize; mapY++) {
          const item = this.getChunkItem(mapX + x, mapY + y)
          if (item) {
            this.map[mapY].splice(mapX, 1, item)
          }
        }
      }
    })
  }

  changeChunk (x, y) {
    const chunkX = chunkOffset(x)
    const chunkY = chunkOffset(y)
    const curChunkInx = chunkLoc(chunkX, chunkY)
    if (this.curChunkInx !== curChunkInx) {
      this.curChunkInx = curChunkInx
    }
    // check nearest chunk is loaded
    const loaders = []
    for (let x = chunkX - 1; x <= chunkX + 1; x++) {
      for (let y = chunkY - 1; y <= chunkY + 1; y++) {
        const inx = chunkLoc(x, y)
        if (!this.chunks[inx]) {
          const chunk = new Chunk(x, y)
          this.addChunk(chunk)
          loaders.push(chunk.loadWorld(this.chunkReader))
        }
      }
    }
    this.loading = true
    return Promise.all(loaders).then(() => {
      this.loading = false
    })
  }

  getChunkItem (x, y) {
    const chunkByLoc = this.getChunkByLoc(x, y)
    if (!chunkByLoc) {
      return
    }
    return chunkByLoc.getItem(round(x), round(y))
  }

  getChunkByLoc (x, y) {
    const chunkInx = chunkLoc(chunkOffset(x), chunkOffset(y))
    return this.chunks[chunkInx]
  }

  move (chunk, item, x, y) {
    const preX = item.x
    const preY = item.y

    return Promise.resolve()
      .then(() => {
        this.getChunkByLoc(x, y).addItem(item, round(x), round(y))
        chunk.removeItem(preX, preY)
      })
  }

  save (cb) {
    return Promise.resolve(Object.values(this.chunks)
      .filter(chunk => chunk.isDirty))
      .then(cb)
      .then(chunks => {
        chunks.forEach(chunk => chunk.isDirty = false)
      })
  }
}

export default Stage
