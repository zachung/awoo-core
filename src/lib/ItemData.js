import Item from './Item'

const kKey = 0
const kChunkName = 1
const kX = 2
const kY = 3
const kProps = 4

class ItemData extends Array {
  constructor (props) {
    super(...props)
  }

  get key () {
    return this[kKey]
  }

  get x () {
    return this[kX]
  }

  get y () {
    return this[kY]
  }

  get chunkName () {
    return this[kChunkName]
  }

  get props () {
    return this[kProps]
  }

  /**
   * @param {Item} item
   * @return ItemData
   */
  static toJson (item) {
    const key = (item.type || item.id) ? `${item.type}:${item.id}` : ''
    return new ItemData([
      key,
      item.chunk ? item.chunk.chunkName : undefined,
      item.x,
      item.y,
      item.props
    ])
  }

  /**
   * @param {string} key
   * @param {string} chunkName
   * @param {number} x
   * @param {number} y
   * @param {Object} props
   * @return {Item}
   */
  static fromJson ([key, chunkName, x, y, props]) {
    // explode key, format: {type}:{id}
    let [type, id] = key.split(':')
    if (id === undefined) {
      // 向下相容
      id = type
      type = 1
    }
    type = parseInt(type)
    id = parseInt(id)
    return new Item({ type, id, x, y, chunkName, props })
  }
}

export default ItemData
