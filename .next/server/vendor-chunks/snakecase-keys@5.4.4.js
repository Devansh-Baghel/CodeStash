"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/snakecase-keys@5.4.4";
exports.ids = ["vendor-chunks/snakecase-keys@5.4.4"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/snakecase-keys@5.4.4/node_modules/snakecase-keys/index.js":
/*!**************************************************************************************!*\
  !*** ./node_modules/.pnpm/snakecase-keys@5.4.4/node_modules/snakecase-keys/index.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst map = __webpack_require__(/*! map-obj */ \"(rsc)/./node_modules/.pnpm/map-obj@4.3.0/node_modules/map-obj/index.js\")\nconst { snakeCase } = __webpack_require__(/*! snake-case */ \"(rsc)/./node_modules/.pnpm/snake-case@3.0.4/node_modules/snake-case/dist.es2015/index.js\")\n\nmodule.exports = function (obj, options) {\n  options = Object.assign({ deep: true, exclude: [], parsingOptions: {} }, options)\n\n  return map(obj, function (key, val) {\n    return [\n      matches(options.exclude, key) ? key : snakeCase(key, options.parsingOptions),\n      val\n    ]\n  }, options)\n}\n\nfunction matches (patterns, value) {\n  return patterns.some(function (pattern) {\n    return typeof pattern === 'string'\n      ? pattern === value\n      : pattern.test(value)\n  })\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvLnBucG0vc25ha2VjYXNlLWtleXNANS40LjQvbm9kZV9tb2R1bGVzL3NuYWtlY2FzZS1rZXlzL2luZGV4LmpzIiwibWFwcGluZ3MiOiJBQUFZOztBQUVaLFlBQVksbUJBQU8sQ0FBQyx1RkFBUztBQUM3QixRQUFRLFlBQVksRUFBRSxtQkFBTyxDQUFDLDRHQUFZOztBQUUxQztBQUNBLDRCQUE0Qiw2Q0FBNkM7O0FBRXpFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCIsInNvdXJjZXMiOlsid2VicGFjazovL2NvZGVzdGFzaC8uL25vZGVfbW9kdWxlcy8ucG5wbS9zbmFrZWNhc2Uta2V5c0A1LjQuNC9ub2RlX21vZHVsZXMvc25ha2VjYXNlLWtleXMvaW5kZXguanM/Y2YyZSJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCdcblxuY29uc3QgbWFwID0gcmVxdWlyZSgnbWFwLW9iaicpXG5jb25zdCB7IHNuYWtlQ2FzZSB9ID0gcmVxdWlyZSgnc25ha2UtY2FzZScpXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaiwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7IGRlZXA6IHRydWUsIGV4Y2x1ZGU6IFtdLCBwYXJzaW5nT3B0aW9uczoge30gfSwgb3B0aW9ucylcblxuICByZXR1cm4gbWFwKG9iaiwgZnVuY3Rpb24gKGtleSwgdmFsKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIG1hdGNoZXMob3B0aW9ucy5leGNsdWRlLCBrZXkpID8ga2V5IDogc25ha2VDYXNlKGtleSwgb3B0aW9ucy5wYXJzaW5nT3B0aW9ucyksXG4gICAgICB2YWxcbiAgICBdXG4gIH0sIG9wdGlvbnMpXG59XG5cbmZ1bmN0aW9uIG1hdGNoZXMgKHBhdHRlcm5zLCB2YWx1ZSkge1xuICByZXR1cm4gcGF0dGVybnMuc29tZShmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHJldHVybiB0eXBlb2YgcGF0dGVybiA9PT0gJ3N0cmluZydcbiAgICAgID8gcGF0dGVybiA9PT0gdmFsdWVcbiAgICAgIDogcGF0dGVybi50ZXN0KHZhbHVlKVxuICB9KVxufVxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/snakecase-keys@5.4.4/node_modules/snakecase-keys/index.js\n");

/***/ })

};
;