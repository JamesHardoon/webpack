/**
 * 使用 dll 技术，对某些库（第三方库：jQuery，react，vue....）进行单独打包
 * 
 * 注意：当你运行 webpack 命令时，默认查找 webpack.config.js 配置文件
 *  要想运行别的配置文件，比如 webpack.dll.js 文件，需要更改命令：webpack --config webpack.dll.js
 * 
 */

const { resolve } = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // 最终打包生成的 [name] --> jquery
    // ['jquery'] 数组形式（可以将 jquery 相关的包，放在这个数组里面一起打包） 要打包的库是 jquery
    jquery: ['jquery']
  },
  output: {
    filename: '[name].js',
    path: resolve(__dirname, 'dll'), // 打包到 dll 文件目录下
    library: '[name]_[hash]', // 打包的库里面向外暴露出去的内容叫什么名字
  },
  plugins: [
    // 打包生成一个 manifest.json 文件，该文件提供和 jquery 的映射关系
    new webpack.DllPlugin({
      name: '[name]_[hash]', // 映射库暴露的内容名称
      path: resolve(__dirname, 'dll/manifest.json'), // 输出文件路径
    })
  ],
  mode: 'production'
}