
      (function(depsGraph) {
        // require 目的L为了加载入口文件
        function require(module) {
          // 定义模块内部的 require 函数
          function localRequire(relativePath) {
            // 为了找到 要引入模块的绝对路径，再通过 require 加载
            return require(depsGraph[module].deps[relativePath]);
          }

          // 定义暴露对象（将来我们模块要暴露的内容）
          var exports = {};

          (function (require, exports, code) {
            eval(code); // 执行入口文件
          })(localRequire, exports, depsGraph[module].code);

          // 作为 require 函数的返回值返回出去
          // 后面的 require 函数能得到暴露的内容
          return exports;
        }

        // 加载入口文件
        require('./src/index.js');
      })({"./src/index.js":{"code":"\"use strict\";\n\nvar _add = _interopRequireDefault(require(\"./add.js\"));\n\nvar _count = _interopRequireDefault(require(\"./count.js\"));\n\nfunction _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n\nconsole.log((0, _add.default)(1, 2));\nconsole.log((0, _count.default)(3, 1));","deps":{"./add.js":"/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/add.js","./count.js":"/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/count.js"}},"/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/add.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nfunction add(x, y) {\n  return x + y;\n}\n\nvar _default = add;\nexports.default = _default;","deps":{}},"/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/count.js":{"code":"\"use strict\";\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.default = void 0;\n\nfunction count(x, y) {\n  return x - y;\n}\n\nvar _default = count;\nexports.default = _default;","deps":{}}})
    