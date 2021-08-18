const fs = require('fs');
const path = require('path');

const babelParser = require('@babel/parser'); // babel 的工具库，会将 babel 解析成一个 抽象语法树
const traverse = require('@babel/traverse').default;// traverse 采用的是 默认暴露的方式，需要加上 default。traverse 是 babel 的工具库，可以收集依赖
const { transformFromAst } = require("@babel/core");

const parser = {
  // 1.获取抽象语法树代码
  getAst(filepath) {
    // 读取文件
    const file = fs.readFileSync(filepath, 'utf-8');
    // 将其解析成 ast 抽象语法树
    const ast = babelParser.parse(file, {
      sourceType: 'module' // 解析文件的模块化方案是 ES Module
    })
    return ast;
  },

  // 2.获取依赖
  getDeps(ast, filepath) {
    const dirname = path.dirname(filepath);
    // 定义存储依赖的容器
    const deps = {};
    // 收集依赖
    traverse(ast, {
      // 内部会遍历 ast 中 program.body，判断里面语句类型
      // 如果 type: ImportDeclaration 就会触发当前函数
      ImportDeclaration({ node }) {
        // 文件相对路径 eg:'./add.js'
        const relativePath = node.source.value;
        // 生成基于入口文件的绝对路径
        const absolutePath = path.resolve(dirname, relativePath);
        // 添加依赖
        deps[relativePath] = absolutePath;
      }
    })
    return deps;
  },

  // 3.将 ast 解析成 code
  getCode(ast) {
    const { code } = transformFromAst(ast, null, {
      presets: ['@babel/preset-env']
    })

    return code;
  }

};

module.exports = parser;