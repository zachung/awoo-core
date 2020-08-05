"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Layer = /*#__PURE__*/function () {
  function Layer(n) {
    _classCallCheck(this, Layer);

    var N = n * n;
    this.map = new Array(N).fill(undefined);
    this.n = n;
    this.isDirty = false;
  }

  _createClass(Layer, [{
    key: "getItem",
    value: function getItem(x, y) {
      return this.map[y * this.n + x];
    }
  }, {
    key: "put",
    value: function put(item, x, y) {
      var inx = y * this.n + x;
      var preItem = this.map[inx];

      if (preItem) {
        // TODO: 與目標交互
        throw Error('stuck by >' + preItem.type + ':' + preItem.id + '<');
      }

      this.map.splice(inx, 1, item);
    }
    /**
     * remove item which location
     * @param x
     * @param y
     * @returns {any} the item been removed
     */

  }, {
    key: "remove",
    value: function remove(x, y) {
      var inx = y * this.n + x;
      return this.map.splice(inx, 1, undefined)[0];
    }
  }, {
    key: "export",
    value: function _export() {
      var arr = {};
      this.map.forEach(function (item) {
        if (!item || item.type === undefined) {
          return;
        }

        var key = item.type + ':' + item.id;

        if (!arr[key]) {
          arr[key] = [];
        }

        arr[key].push([item.x, item.y, item.props]);
      });
      return arr;
    }
  }]);

  return Layer;
}();

var _default = Layer;
exports["default"] = _default;