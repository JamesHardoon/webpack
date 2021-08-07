const { resolve } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: resolve(__dirname, "./build")
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        loader: "url-loader",
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: "[hash:10].[ext]"
        }
      },
      {
        test: /\.css$/, // 匹配以 .css 结尾的文件
        use: ["style-loader", "css-loader"]
      },
      // 打包其他资源（除了 html/js/css 资源以外的资源）
      {
        // 排除 css/js/html 资源
        exclude: /\.(css|js|html|less)$/,
        loader: "file-loader",
        options: {
          name: "[hahs: 10].[ext]"
        }
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  mode: 'development'
}