"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Layer = _interopRequireDefault(require("./Layer"));

var _ChunkReader = _interopRequireDefault(require("./ChunkReader"));

var _Item = _interopRequireDefault(require("./Item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var N = 32;

var initGroupLayer = function initGroupLayer(chunk) {
  var groundLayer = new _Layer["default"](N);

  for (var x = 0; x < N; x++) {
    for (var y = 0; y < N; y++) {
      var empty = _Item["default"].fromData(['0:0', '', x, y, {}]);

      empty.chunk = chunk;
      groundLayer.put(empty, x, y);
    }
  }

  return groundLayer;
};
/**
 * 32*32 blocks
 * @property {Layer} groundLayer
 * @property {Layer} itemLayer
 */


var Chunk = /*#__PURE__*/function () {
  function Chunk(offsetX, offsetY) {
    _classCallCheck(this, Chunk);

    this.chunkName = Chunk.getChunkName(offsetX, offsetY);
    this.groundLayer = initGroupLayer(this);
    this.itemLayer = new _Layer["default"](N);
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }

  _createClass(Chunk, [{
    key: "loadWorld",

    /**
     * @param {ChunkReader} reader
     * @returns {PromiseLike<any> | Promise<any>}
     */
    value: function loadWorld(reader) {
      var _this = this;

      return reader.load(this.chunkName, function (layer, item) {
        if (layer === 'grounds') {
          item.chunk = _this;

          _this.groundLayer.remove(item.x, item.y);

          _this.groundLayer.put(item, item.x, item.y);

          return;
        }

        _this.addItem(item);
      }).then(function () {
        // 初始載入不需要關注
        _this.itemLayer.isDirty = false;
      });
    }
  }, {
    key: "getItem",
    value: function getItem(offsetX, offsetY) {
      var item = undefined;
      [this.itemLayer, this.groundLayer].some(function (layer) {
        item = layer.getItem(offsetX, offsetY);

        if (item) {
          return true;
        }
      });
      return item;
    }
  }, {
    key: "addItem",
    value: function addItem(item, x, y) {
      x = x !== undefined ? x : item.x;
      y = y !== undefined ? y : item.y;
      this.itemLayer.put(item, x, y);
      this.itemLayer.isDirty = true;
      item.chunk = this;
    }
  }, {
    key: "removeItem",
    value: function removeItem(x, y) {
      var removed = this.itemLayer.remove(x, y);

      if (removed !== undefined) {
        this.itemLayer.isDirty = true;
      }
    }
  }, {
    key: "export",
    value: function _export() {
      if (this.isDirty || !this._worldExportCache) {
        var grounds = this.groundLayer["export"]();
        var items = this.itemLayer["export"]();
        this._worldExportCache = {
          grounds: grounds,
          items: items
        };
      }

      return this._worldExportCache;
    }
  }, {
    key: "isDirty",
    get: function get() {
      // 目前只有 itemLayer 會變動
      return this.itemLayer.isDirty;
    },
    set: function set(isDirty) {
      this.itemLayer.isDirty = isDirty;
    }
  }], [{
    key: "fromName",
    value: function fromName(chunkName) {
      var re = /(\d+)(\w)(\d+)(\w)/;

      var _chunkName$match = chunkName.match(re),
          _chunkName$match2 = _slicedToArray(_chunkName$match, 5),
          offsetX = _chunkName$match2[1],
          xd = _chunkName$match2[2],
          offsetY = _chunkName$match2[3],
          yd = _chunkName$match2[4];

      offsetX = parseInt(xd === 'W' ? -offsetX : offsetX);
      offsetY = parseInt(yd === 'N' ? -offsetY : offsetY);
      return new Chunk(offsetX, offsetY);
    }
  }, {
    key: "getChunkName",
    value: function getChunkName(offsetX, offsetY) {
      var WE = offsetX >= 0 ? 'E' : 'W';
      var NS = offsetY < 0 ? 'N' : 'S';
      return Math.abs(offsetX) + WE + Math.abs(offsetY) + NS;
    }
  }]);

  return Chunk;
}();

var _default = Chunk;
exports["default"] = _default;