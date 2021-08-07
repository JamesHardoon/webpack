const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配以 .css 结尾的文件
        use: [
          // 创建 style 标签，将样式放入
          // 'style-loader',

          // 这个 loader 取代 style loader。作用：提取 js 中的 css 成单独的文件
          // !!! 这里需要注意，要使用 MiniCssExtractPlugin.loader 取代 style-loader 
          MiniCssExtractPlugin.loader,
          // 将 css 文件整合到 js 中
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    /**
     * 下载插件：mini-css-extract-plugin    cnpm i mini-css-extract-plugin -D
     * 用于提取 css 成一个单独的文件
     */
    new MiniCssExtractPlugin({
      // 对输出的 css 文件进行重命名
      filename: 'css/built.css'
    })
  ],
  mode: 'development'
}