const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/bundle.js",
    path: resolve(__dirname, "./build")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'production',
  externals: {
    // 忽略库名，jquery表示 库名，jQuery 表示 npm 包名
    // 拒绝 jQuery 包被打包进来
    jquery: 'jQuery',
  }
}