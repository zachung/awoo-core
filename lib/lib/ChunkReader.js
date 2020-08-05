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

var createLayerLoader = function createLayerLoader(cb) {
  return function (layer, items) {
    var _loop = function _loop(key) {
      if (!items.hasOwnProperty(key)) {
        return "continue";
      }

      items[key].forEach(function (props) {
        cb(layer, _ItemData["default"].fromJson({
          key: key,
          props: props
        }));
      });
    };

    // load items
    for (var key in items) {
      var _ret = _loop(key);

      if (_ret === "continue") continue;
    }
  };
};

var ChunkReader = /*#__PURE__*/function () {
  function ChunkReader() {
    _classCallCheck(this, ChunkReader);
  }

  _createClass(ChunkReader, [{
    key: "load",
    value: function load(chunk, cb) {
      var _this = this;

      return this.fetchData(chunk).then(function (chunkData) {
        return _this.fromData(chunkData, cb);
      });
    }
  }, {
    key: "fetchData",
    value: function fetchData(chunk) {
      throw Error('you must implement this method');
    }
  }, {
    key: "fromData",
    value: function fromData(chunkData, cb) {
      var loader = createLayerLoader(cb);

      for (var layer in chunkData) {
        if (!chunkData.hasOwnProperty(layer)) {
          continue;
        }

        loader(layer, chunkData[layer]);
      }
    }
  }]);

  return ChunkReader;
}();

var _default = ChunkReader;
exports["default"] = _default;