"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Chunk = _interopRequireDefault(require("./Chunk"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var chunkLoc = function chunkLoc(x, y) {
  return x.toString() + '_' + y.toString();
};

var ChunkSize = 32;

var round = function round(p) {
  return (p % ChunkSize + ChunkSize) % ChunkSize;
};

var chunkOffset = function chunkOffset(p) {
  return Math.floor(p / ChunkSize);
};
/**
 * @property {Number} viewSize
 * @property {Object} cameraDelta 鏡頭偏移(距離左上角距離)
 */


var Stage = /*#__PURE__*/function () {
  function Stage(_ref) {
    var viewSize = _ref.viewSize,
        cameraDelta = _ref.cameraDelta;

    _classCallCheck(this, Stage);

    this.loading = false;
    this.chunks = {};
    this.map = []; // init fallback

    for (var x = 0; x < viewSize; x++) {
      this.map[x] = [];

      for (var y = 0; y < viewSize; y++) {
        this.map[x][y] = undefined;
      }
    }

    this.viewSize = viewSize;
    this.cameraDelta = cameraDelta;
  }

  _createClass(Stage, [{
    key: "addChunk",
    value: function addChunk(chunk) {
      this.chunks[chunkLoc(chunk.offsetX, chunk.offsetY)] = chunk;
      chunk.setStage(this);
    }
  }, {
    key: "cameraGoTo",
    value: function cameraGoTo(x, y) {
      var _this = this;

      this.cameraAt = {
        x: x,
        y: y
      };
      x -= this.cameraDelta.x;
      y -= this.cameraDelta.y;
      return this.changeChunk(x, y).then(function () {
        for (var mapX = 0; mapX < _this.viewSize; mapX++) {
          for (var mapY = 0; mapY < _this.viewSize; mapY++) {
            var item = _this.getChunkItem(mapX + x, mapY + y);

            if (item) {
              _this.map[mapY].splice(mapX, 1, item);
            }
          }
        }
      });
    }
  }, {
    key: "changeChunk",
    value: function changeChunk(x, y) {
      var _this2 = this;

      var chunkX = chunkOffset(x);
      var chunkY = chunkOffset(y);
      var curChunkInx = chunkLoc(chunkX, chunkY);

      if (this.curChunkInx !== curChunkInx) {
        this.curChunkInx = curChunkInx;
      } // check nearest chunk is loaded


      var loaders = [];

      for (var _x = chunkX - 1; _x <= chunkX + 1; _x++) {
        for (var _y = chunkY - 1; _y <= chunkY + 1; _y++) {
          var inx = chunkLoc(_x, _y);

          if (!this.chunks[inx]) {
            var chunk = new _Chunk["default"](_x, _y);
            this.addChunk(chunk);
            loaders.push(chunk.loadWorld());
          }
        }
      }

      this.loading = true;
      return Promise.all(loaders).then(function () {
        _this2.loading = false;
      });
    }
  }, {
    key: "getChunkItem",
    value: function getChunkItem(x, y) {
      var chunkByLoc = this.getChunkByLoc(x, y);

      if (!chunkByLoc) {
        return;
      }

      return chunkByLoc.getItem(round(x), round(y));
    }
  }, {
    key: "getChunkByLoc",
    value: function getChunkByLoc(x, y) {
      var chunkInx = chunkLoc(chunkOffset(x), chunkOffset(y));
      return this.chunks[chunkInx];
    }
  }, {
    key: "move",
    value: function move(chunk, item, x, y) {
      var _this3 = this;

      var preX = item.x;
      var preY = item.y;
      return Promise.resolve().then(function () {
        _this3.getChunkByLoc(x, y).addItem(item, round(x), round(y));

        chunk.removeItem(preX, preY);
      });
    }
  }, {
    key: "save",
    value: function save(cb) {
      return Promise.resolve(Object.values(this.chunks).filter(function (chunk) {
        return chunk.isDirty;
      })).then(cb).then(function (chunks) {
        chunks.forEach(function (chunk) {
          return chunk.isDirty = false;
        });
      });
    }
  }, {
    key: "chunk",
    get: function get() {
      return this.chunks[this.curChunkInx];
    }
  }]);

  return Stage;
}();

var _default = Stage;
exports["default"] = _default;