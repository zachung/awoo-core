"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _ItemData = _interopRequireDefault(require("./ItemData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ChunkSize = 32;
/**
 * @property {number} type
 * @property {number} id
 * @property {Chunk} chunk
 * @property {string} color 字體顏色
 * @property {string} bgColor 背景顏色
 * @property {Object} props 屬性
 */

var Item = /*#__PURE__*/function () {
  function Item(data) {
    _classCallCheck(this, Item);

    var type = data.type,
        id = data.id,
        x = data.x,
        y = data.y,
        props = data.props;
    this.type = type;
    this.id = id;
    this.chunk = undefined;
    this.props = props || {};

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
    /**
     * @return {ItemData}
     */

  }, {
    key: "toData",
    value: function toData() {
      return _ItemData["default"].toJson(this);
    }
    /**
     * @returns {Item}
     */

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
  }], [{
    key: "fromData",
    value: function fromData(data) {
      return _ItemData["default"].fromJson(data);
    }
  }]);

  return Item;
}();

var _default = Item;
exports["default"] = _default;