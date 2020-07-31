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
    const loader = createLayerLoader(cb)
    return this.fetchData(chunk)
      .then(chunk => {
        for (const layer in chunk) {
          if (!chunk.hasOwnProperty(layer)) {
            continue
          }
          loader(layer, chunk[layer])
        }
      })
  }

  fetchData (chunk) {
    throw Error('you must implement this method')
  }
}

export default ChunkReader
