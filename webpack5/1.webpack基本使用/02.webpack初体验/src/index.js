/**
 * index.js：webpack 入口起点文件
 * 
 * 1.运行指令
 *  开发环境：webpack ./src/index.js -o ./build --mode=development
 *    含义：webpack 会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build 文件夹的 main.js 中，整体打包环境是开发环境
 *  生产环境：webpack ./src/index.js -o ./build --mode=production
 *    含义：webpack 会以 ./src/index.js 为入口文件开始打包，打包后输出到 ./build 文件夹的 main.js 中，整体打包环境是生产环境
 * 
 * 2.结论
 *  1.webpack 能处理 js/json 文件，不能处理 css/img 等资源文件；
 *  2.生产环境和开发环境将 ES6 模块化编译成浏览器能识别的模块化；
 *  3.生产环境比开发环境多一个压缩 js 代码；
 */

import data from "./data.json"; // ES6 模块化形式引入文件
// import "./index.css";

console.log(data);

function add(x, y) {
  return x + y;
}

console.log(add(2, 3));