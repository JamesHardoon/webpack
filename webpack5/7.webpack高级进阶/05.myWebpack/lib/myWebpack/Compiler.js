const path = require('path');
const fs = require('fs');

const { getAst, getDeps, getCode } = require('./parser');

class Compiler {
  constructor(options = {}) {
    // webpack 配置对象
    this.options = options;
    // 所有依赖的容器
    this.modules = [];
  }

  // 启动 webpack 打包
  run() {
    // 入口文件路径
    const filepath = this.options.entry;
    // 第一次构建，得到入口文件的信息
    const fileInfo = this.build(filepath);

    this.modules.push(fileInfo);

    // 遍历所有的依赖
    this.modules.forEach((fileInfo) => {
      /**
       * deps 如下所示：
        {
          './add.js': '/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/add.js',
          './count.js': '/Users/fangzhi/Documents/website/JamesHardoon/webpack-master/webpack5/7.webpack高级进阶/05.myWebpack/src/count.js'
        }
       */
      // 取出当前文件的所有依赖
      const deps = fileInfo.deps;
      // 遍历
      for (const relativePath in deps) {
        // 依赖文件的绝对路径
        const absolutePath = deps[relativePath];
        // 对依赖文件进行处理
        const fileInfo = this.build(absolutePath);
        // 将处理后的结果添加到 modules 中，后面遍历就会遍历它了
        this.modules.push(fileInfo);
      }
    })

    // 将依赖整理更好依赖关系图
    /**
     * 整理成如下的关系依赖：
      {
        'index.js': {
          code: 'xxx',
          deps: {'add.js','count.js', ...}
        },
        'add.js': {
          code: 'xxx',
          deps: {}
        },
        'count.js': {
          code: 'xxx',
          deps: {}
        }
      }
     */
    // 依赖图表
    const depsGraph = this.modules.reduce((graph, module) => {
      return {
        ...graph,
        [module.filepath]: {
          code: module.code,
          deps: module.deps
        }
      }
    }, {})

    console.log('depsGraph: ', depsGraph)
    this.generate(depsGraph);
  }

  // 生成输出资源
  generate(depsGraph) {
    /*
    index.js 代码：
      "use strict";\n' +
        '\n' +
        'var _add = _interopRequireDefault(require("./add.js"));\n' +
        '\n' +
        'var _count = _interopRequireDefault(require("./count.js"));\n' +
        '\n' +
        'function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }\n' +
        '\n' +
        'console.log((0, _add.default)(1, 2));\n' +
        'console.log((0, _count.default)(3, 1));'
      }
    */
    const bundle = `
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
        require('${this.options.entry}');
      })(${JSON.stringify(depsGraph)})
    `

    // 生成输出文件的绝对路径
    const filePath = path.resolve(this.options.output.path, this.options.output.filename);
    // 写入文件
    fs.writeFileSync(filePath, bundle, 'utf-8');
  }

  // 开间构建
  build(filepath) {
    // 1.将文件解析成 抽象语法树 ast
    const ast = getAst(filepath);
    // 2.获取 ast 中所有的依赖
    const deps = getDeps(ast, filepath);
    // 3.将 ast 解析成 code
    const code = getCode(ast);

    return {
      // 文件路径
      filepath,
      // 当前文件的所有依赖
      deps,
      // 当前文件解析后的代码
      code
    }
  }

}

module.exports = Compiler;