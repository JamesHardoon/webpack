/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/data.json":
/*!***********************!*\
  !*** ./src/data.json ***!
  \***********************/
/***/ ((module) => {

eval("module.exports = JSON.parse('{\"name\":\"Fitz\",\"age\":18}');\n\n//# sourceURL=webpack://webpack_test/./src/data.json?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _data_json__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./data.json */ \"./src/data.json\");\n/**\n * index.js：webpack 入口起点文件\n * \n * 1.运行指令\n *  开发环境：webpack ./src/index.js -o ./build --mode=development\n *    含义：webpack 会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build 文件夹的 main.js 中，整体打包环境是开发环境\n *  生产环境：webpack ./src/index.js -o ./build --mode=production\n *    含义：webpack 会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build 文件夹的 main.js 中，整体打包环境是生产环境\n * \n * 2.结论\n *  1.webpack 能处理 js/json 文件，不能处理 css/img 等资源文件；\n *  2.生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化；\n *  3.生产环境比开发环境多一个压缩 js 代码；\n */\n\n // ES6 模块化形式引入文件\n// import \"./index.css\";\n\nconsole.log(_data_json__WEBPACK_IMPORTED_MODULE_0__);\n\nfunction add(x, y) {\n  return x + y;\n}\n\nconsole.log(add(2, 3));\n\n//# sourceURL=webpack://webpack_test/./src/index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;