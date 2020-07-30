class Layer {
  constructor (n) {
    const N = n * n
    this.map = new Array(N).fill(undefined)
    this.n = n
    this.isDirty = false
  }

  getItem (x, y) {
    return this.map[y * this.n + x]
  }

  put (item, x, y) {
    const inx = y * this.n + x
    const preItem = this.map[inx]
    if (preItem) {
      // TODO: 與目標交互
      throw Error('stuck by >' + preItem.type + ':' + preItem.id + '<')
    }
    this.map.splice(inx, 1, item)
  }

  /**
   * remove item which location
   * @param x
   * @param y
   * @returns {any} the item been removed
   */
  remove (x, y) {
    const inx = y * this.n + x
    return this.map.splice(inx, 1, undefined)[0]
  }

  export () {
    const arr = {}
    this.map.forEach(item => {
      if (!item || item.type === undefined) {
        return
      }
      const key = item.type + ':' + item.id
      if (!arr[key]) {
        arr[key] = []
      }
      arr[key].push([item.x, item.y])
    })
    return arr
  }
}

export default Layer
