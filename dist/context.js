'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JetContext = function () {
  function JetContext() {
    _classCallCheck(this, JetContext);

    this.stack = [];
    this.namedContext = {};
  }

  _createClass(JetContext, [{
    key: 'top',
    value: function top() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      return this.stack.length ? this.stack[n] : {};
    }
  }, {
    key: 'push',
    value: function push(context, name) {
      var clone = context;

      if ((typeof context === 'undefined' ? 'undefined' : _typeof(context)) === 'object') {
        clone = JSON.parse(JSON.stringify(context));
      }

      var newContext = {
        value: clone
      };

      if (name) {
        newContext.name = name;
        this.namedContext[name] = newContext;
      }

      this.stack.unshift(newContext);
    }
  }, {
    key: 'pop',
    value: function pop() {
      this.stack.unshift();
    }
  }, {
    key: 'getAttr',
    value: function getAttr(a, ctx) {
      var result = ctx;
      var attribute = a;
      var index = void 0;

      var b = a.indexOf('[');

      if (b !== -1) {
        attribute = a.substr(0, b);
        index = a.substr(b);
        result = attribute === '' ? result : result[attribute];
        if (result === undefined) {
          return result;
        }
        var indices = index.replace(/[[\]]/g, ' ').trim().replace(/\s{2,}/g, ' ').split(' ');
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = indices[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var i = _step.value;

            result = result[this.get(i)];
            if (result === undefined) {
              return result;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        return result;
      }

      return result[attribute];
    }
  }, {
    key: 'getObj',
    value: function getObj(d, ctx) {
      var result = ctx;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = d[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var attr = _step2.value;

          result = this.getAttr(attr, result);
          if (result === undefined) {
            return result;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return result;
    }
  }, {
    key: 'getContext',
    value: function getContext(expr, context) {
      var result = void 0;
      if (expr === '') {
        return '';
      }

      if (expr === '.') {
        return context[0].value;
      }

      if (expr.charAt(0) === '.') {
        return this.getContext(expr.slice(1), context.slice(0, 1));
      }

      if (/^\d*$/.test(expr)) {
        // it's a number
        return parseInt(expr, 10);
      }

      if (/^\$\$/.test(expr)) {
        // it's a special $$attribute
        return context[0][expr.slice(2)];
      }

      var d = expr.split('.');
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = context[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var ctx = _step3.value;

          result = this.getObj(d, ctx.value);
          if (result !== undefined) {
            return result;
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return '';
    }
  }, {
    key: 'get',
    value: function get() {
      var expr = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      return this.getContext(expr, this.stack);
    }
  }]);

  return JetContext;
}();

exports.default = JetContext;
//# sourceMappingURL=context.js.map