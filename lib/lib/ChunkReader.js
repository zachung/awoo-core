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

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var kX = 0;
var kY = 1;

var createLayerLoader = function createLayerLoader(cb) {
  return function (layer, items) {
    var _loop = function _loop(key) {
      if (!items.hasOwnProperty(key)) {
        return "continue";
      }

      items[key].forEach(function (props) {
        // explode key, format: {type}:{id}
        var _key$split = key.split(':'),
            _key$split2 = _slicedToArray(_key$split, 2),
            type = _key$split2[0],
            id = _key$split2[1];

        if (id === undefined) {
          // 向下相容
          id = type;
          type = 1;
        }

        var item = new _Item["default"]({
          type: type,
          id: id,
          x: props[kX],
          y: props[kY]
        });
        cb(layer, item);
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
      var loader = createLayerLoader(cb);
      return this.fetchData(chunk).then(function (chunk) {
        for (var layer in chunk) {
          if (!chunk.hasOwnProperty(layer)) {
            continue;
          }

          loader(layer, chunk[layer]);
        }
      });
    }
  }, {
    key: "fetchData",
    value: function fetchData(chunk) {
      throw Error('you must implement this method');
    }
  }]);

  return ChunkReader;
}();

var _default = ChunkReader;
exports["default"] = _default;