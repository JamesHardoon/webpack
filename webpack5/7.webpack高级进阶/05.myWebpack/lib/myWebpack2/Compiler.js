const { getAst, getDeps, getCode } = require('./parser');

class Compiler {
  constructor(options = {}) {
    this.options = options;
  }

  // 启动 webpack 打包
  run() {
    // 入口文件路径
    const filepath = this.options.entry;
    // 1.将文件解析成 抽象语法树 ast
    const ast = getAst(filepath);
    // 2.获取 ast 中所有的依赖
    const deps = getDeps(ast, filepath);
    // 3.将 ast 解析成 code
    const code = getCode(ast);

    console.log('ast:', ast);
    console.log('deps: ', deps);
    console.log('code: ', code);

  }
}

module.exports = Compiler;