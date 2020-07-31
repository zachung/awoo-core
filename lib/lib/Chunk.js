"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Item = _interopRequireDefault(require("./Item"));

var _Layer = _interopRequireDefault(require("./Layer"));

var _ChunkReader = _interopRequireDefault(require("./ChunkReader"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var N = 32;

var initGroupLayer = function initGroupLayer(chunk) {
  var groundLayer = new _Layer["default"](N);

  for (var x = 0; x < N; x++) {
    for (var y = 0; y < N; y++) {
      var empty = new _Item["default"]({
        x: x,
        y: y
      });
      empty.chunk = chunk;
      groundLayer.put(empty, x, y);
    }
  }

  return groundLayer;
};
/**
 * 32*32 blocks
 * @property {Stage} stage
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
    key: "setStage",
    value: function setStage(stage) {
      this.stage = stage;
    }
  }, {
    key: "loadWorld",
    value: function loadWorld() {
      var _this = this;

      var worldReader = new _ChunkReader["default"]();
      return worldReader.load(this.chunkName, function (layer, item) {
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
    key: "move",
    value: function move(item, x, y) {
      return this.stage.move(this, item, x, y);
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