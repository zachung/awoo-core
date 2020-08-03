"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ChunkSize = 32;

var round = function round(p) {
  return (p % ChunkSize + ChunkSize) % ChunkSize;
};
/**
 * @property {Chunk} chunk
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 */


var Item = /*#__PURE__*/function () {
  function Item(_ref) {
    var type = _ref.type,
        id = _ref.id,
        x = _ref.x,
        y = _ref.y;

    _classCallCheck(this, Item);

    this.type = type;
    this.id = id;
    this.chunk = undefined;

    if (x !== undefined) {
      this.setLocalPosition(x, y);
    }
  }

  _createClass(Item, [{
    key: "setLocalPosition",
    value: function setLocalPosition(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "removeSelf",
    value: function removeSelf() {
      this.chunk.removeItem(this.x, this.y);
    }
    /**
     *
     * @param {Chunk} chunk
     */

  }, {
    key: "setIn",
    value: function setIn(chunk) {
      chunk.addItem(this);
    }
  }, {
    key: "globalX",
    get: function get() {
      return this.chunk.offsetX * ChunkSize + this.x;
    }
  }, {
    key: "globalY",
    get: function get() {
      return this.chunk.offsetY * ChunkSize + this.y;
    }
  }]);

  return Item;
}();

var _default = Item;
exports["default"] = _default;