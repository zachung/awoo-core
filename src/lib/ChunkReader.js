import ItemData from './ItemData'

const createLayerLoader = cb => {
  return (layer, items) => {
    // load items
    for (const key in items) {
      if (!items.hasOwnProperty(key)) {
        continue
      }
      items[key].forEach(props => {
        cb(layer, ItemData.fromJson({ key, props }))
      })
    }
  }
}

class ChunkReader {
  load (chunk, cb) {
    return this.fetchData(chunk).then(chunkData =>
      this.fromData(chunkData, cb)
    )
  }

  fetchData (chunk) {
    throw Error('you must implement this method')
  }

  fromData (chunkData, cb) {
    const loader = createLayerLoader(cb)
    for (const layer in chunkData) {
      if (!chunkData.hasOwnProperty(layer)) {
        continue
      }
      loader(layer, chunkData[layer])
    }
  }
}

export default ChunkReader
