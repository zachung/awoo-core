"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Item = _interopRequireDefault(require("./Item"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var createLayerLoader = function createLayerLoader(chunkName, cb) {
  return function (layer, items) {
    var _loop = function _loop(key) {
      if (!items.hasOwnProperty(key)) {
        return "continue";
      }

      items[key].forEach(function (props) {
        cb(layer, _Item["default"].fromData([key, chunkName].concat(_toConsumableArray(props))));
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
    value: function load(chunkName, cb) {
      var _this = this;

      return this.fetchData(chunkName).then(function (chunkData) {
        return _this._fromData(chunkName, chunkData, cb);
      });
    }
  }, {
    key: "fetchData",
    value: function fetchData(chunkName) {
      throw Error('you must implement this method');
    }
  }, {
    key: "_fromData",
    value: function _fromData(chunkName, chunkData, cb) {
      var loader = createLayerLoader(chunkName, cb);

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