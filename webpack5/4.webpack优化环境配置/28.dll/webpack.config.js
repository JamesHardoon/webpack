const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: resolve(__dirname, "./build")
  },
  module: {
    rules: [
      // loader 配置
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    /**
     * 告诉 webpack 哪些库不参与打包，
     * 同时使用时的名称也得变
     * 
     * 不打包 jquery
     */
    new webpack.DllReferencePlugin({
      manifest: resolve(__dirname, "dll/manifest.json")
    }),
    /**
     * 将某个文件打包输出去，并在 html 文件中自动引入该资源
     * 
     * 加了这个配置后，会在 build/index.html 文件中自动引入 jquery.js 
     * 
     * 因为前面没有 打包 jquery，AddAssetHtmlWebpackPlugin 插件就是提前将 jquery 引入到 index.html 中
     * 
     * 注意：打包后在 build/index.html 中引入的 jquery 文件 会多了一层 auto 路径，会提示报错，找不到 jquery，需要手动去除，目前没找到是什么原因引起的 
     */
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve(__dirname, './dll/jquery.js')
    })
  ],
  mode: 'production',
}