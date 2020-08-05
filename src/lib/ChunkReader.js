import ItemData from './ItemData'

const createLayerLoader = (chunkName, cb) => {
  return (layer, items) => {
    // load items
    for (const key in items) {
      if (!items.hasOwnProperty(key)) {
        continue
      }
      items[key].forEach(props => {
        cb(layer, ItemData.fromJson([key, chunkName, ...props]))
      })
    }
  }
}

class ChunkReader {
  load (chunkName, cb) {
    return this.fetchData(chunkName).then(chunkData =>
      this._fromData(chunkName, chunkData, cb)
    )
  }

  fetchData (chunkName) {
    throw Error('you must implement this method')
  }

  _fromData (chunkName, chunkData, cb) {
    const loader = createLayerLoader(chunkName, cb)
    for (const layer in chunkData) {
      if (!chunkData.hasOwnProperty(layer)) {
        continue
      }
      loader(layer, chunkData[layer])
    }
  }
}

export default ChunkReader
