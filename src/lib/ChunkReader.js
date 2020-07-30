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
    return this.getJSON('world/' + chunk + '.json')
      .then(chunk => {
        for (const layer in chunk) {
          if (!chunk.hasOwnProperty(layer)) {
            continue
          }
          loader(layer, chunk[layer])
        }
      })
  }

  getJSON (url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('GET', url, true)
      xhr.responseType = 'json'
      xhr.onload = () => {
        const status = xhr.status
        if (status === 200) {
          resolve(xhr.response)
        } else {
          reject(status, xhr.response)
        }
      }
      xhr.send()
    })
  }
}

export default ChunkReader
