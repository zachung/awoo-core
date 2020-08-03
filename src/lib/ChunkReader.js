import Item from './Item'

const kX = 0
const kY = 1

const createLayerLoader = cb => {
  return (layer, items) => {
    // load items
    for (const key in items) {
      if (!items.hasOwnProperty(key)) {
        continue
      }
      items[key].forEach(props => {
        // explode key, format: {type}:{id}
        let [type, id] = key.split(':')
        if (id === undefined) {
          // 向下相容
          id = type
          type = 1
        }
        const item = new Item({
          type,
          id,
          x: props[kX],
          y: props[kY]
        })
        cb(layer, item)
      })
    }
  }
}

class ChunkReader {
  load (chunk, cb) {
    return this.fetchData(chunk)
      .then(chunkData => this.fromData(chunkData, cb))
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
