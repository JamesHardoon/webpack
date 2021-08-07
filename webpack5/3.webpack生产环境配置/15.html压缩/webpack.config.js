const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: []
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      // 压缩 html 文件的配置写到这里
      minify: {
        // 移除空格
        collapseWithSpaces: true,
        // 移除注释
        removeComments: true
      }
    }),
  ],
  mode: 'development',
}