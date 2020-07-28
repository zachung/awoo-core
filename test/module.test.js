const { Symbols, Chunk, Item, Layer, Stage } = require('../src/index')

describe('測試模組載入', () => {
  it('各項載入', () => {
    if (!Symbols) {
      throw new Error('Symbols 載入失敗')
    }
    if (!Chunk) {
      throw new Error('Chunk 載入失敗')
    }
    if (!Item) {
      throw new Error('Item 載入失敗')
    }
    if (!Layer) {
      throw new Error('Layer 載入失敗')
    }
    if (!Stage) {
      throw new Error('Stage 載入失敗')
    }
  })
  it('Symbols 內層載入測試', () => {
    if (!Symbols.Blocks || Symbols.Blocks.length <= 0) {
      throw new Error('Symbols 載入失敗')
    }
  })
})
