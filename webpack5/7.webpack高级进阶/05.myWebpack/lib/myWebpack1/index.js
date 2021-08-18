const fs = require('fs');
const path = require('path');

const babelParser = require('@babel/parser'); // babel 的工具库，会将 babel 解析成一个 抽象语法树
const traverse = require('@babel/traverse').default;// traverse 采用的是 默认暴露的方式，需要加上 default。traverse 是 babel 的工具库，可以收集依赖
const { transformFromAst } = require("@babel/core");

function myWebpack(config) {

  return new Compiler(config);
}

class Compiler {
  constructor(options = {}) {
    this.options = options;
  }

  // 启动 webpack 打包
  run() {
    // 1. 读取入口文件内容
    const filepath = this.options.entry; // 入口文件路径
    const file = fs.readFileSync(filepath, 'utf-8'); // 默认返回的是一个 Buffer 数据，而解析的抽象语法树是一个纯文本数据，通常简单做法是：fs.readFileSync(filepath, 'utf-8');
    // 2. 将其解析成 ast 抽象语法树
    const ast = babelParser.parse(file, {
      sourceType: 'module', // 解析文件的模块化方案是 ES Module
    })
    // debugger
    console.log(ast);

    // 获取到文件的文件夹路径
    const dirname = path.dirname(filepath);

    // 定义存储依赖的容器
    const deps = {};

    // 收集所有的依赖
    traverse(ast, {
      // 内部会遍历 ast 中 program.body，判断里面语句类型
      // 如果 type：ImportDeclaration 就会触发当前函数
      ImportDeclaration({node}) {
        const relativePath = node.source.value; // 文件相对路径 './add.js'
        const absolutePath = path.resolve(dirname, relativePath); // 生成基于入口文件的绝对路径
        console.log(absolutePath);

        deps[relativePath] = absolutePath; // 添加依赖
      }
    })
    console.log(deps);

    // 3.编译代码，将代码中浏览器不能识别的语法进行编译
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })
    console.log(code);
  }
}

module.exports = myWebpack;