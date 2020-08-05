import Item from './Item'

const kX = 0
const kY = 1
const kChunkName = 2
const kProps = 3

/**
 * @property {string} key
 * @property {array} props
 */
class ItemData {
  /**
   * @param {Item} item
   * @return ItemData
   */
  static toJson (item) {
    return {
      key: `${item.type}:${item.id}`,
      props: [
        item.x,
        item.y,
        item.chunk ? item.chunk.chunkName : undefined,
        item.props
      ],
    }
  }

  /**
   * @param {ItemData} itemData
   */
  static fromJson (itemData) {
    const { key, props } = itemData
    // explode key, format: {type}:{id}
    let [type, id] = key.split(':')
    if (id === undefined) {
      // 向下相容
      id = type
      type = 1
    }
    type = parseInt(type)
    id = parseInt(id)
    return new Item({
      type,
      id,
      x: props[kX],
      y: props[kY],
      chunkName: props[kChunkName],
      props: props[kProps]
    })
  }
}

export default ItemData
