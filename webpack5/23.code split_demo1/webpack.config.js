const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // entry: './src/js/index.js', // 单入口
  entry: {
    main: './src/js/index.js',
    test: './src/js/test.js',
  },
  output: {
    // [name] 取文件名
    filename: 'js/[name].[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: { // 压缩 html 文件 配置
        collapseWithSpaces: true, // 压缩空格
        removeComments: true, // 移除 html 文件的注释
      }
    }),
  ],
  mode: 'production',
}