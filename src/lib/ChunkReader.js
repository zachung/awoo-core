import Symbols from '../data/Symbols'
import Item from './Item'

const newItem = (symbol, x, y) => {
  const item = new Item(symbol)
  item.setLocalPosition(x, y)
  return item
}

class ChunkReader {
  load (chunk, cb) {
    return this.getJSON('world/' + chunk + '.json')
      .then(chunk => {
        // load items
        const items = chunk.items
        for (const id in items) {
          if (!items.hasOwnProperty(id)) {
            continue
          }
          items[id].forEach(item => {
            cb(newItem(Symbols.Blocks[id], ...item))
          })
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
