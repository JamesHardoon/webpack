const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "built.js",
    path: path.join(__dirname, "./build")
  },
  module: {
    rules: [
      // loader 配置
      {
        test: /\.less$/,
        // 要使用多个 loader 处理用 use，单个 loader 直接使用 loader
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        // 问题：默认处理不了 html 中的 img 图片
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        // 使用一个 loader
        // 下载 url-loader file-loader
        // 单个 loader 直接使用 loader
        loader: 'url-loader',
        options: {
          /**
           * 图片大小小于 8kb，就会被 base64 处理
           * 优点：减少请求数量（减去服务器压力）
           * 缺点：图片体积会更大（文件请求速度更慢）
           */
          limit: 8 * 1024,
          /**
           * 问题：因为 url-loader 默认使用 es6 模块化解析，而 html-loader 引入图片是 commonjs,
           * 解析时会出问题：[object Module],
           * 解决：关闭 url-loader 的 es6 模块化，使用 commonjs 解析
           */
          esModule: false,
          /**
           * 给图片进行重命名
           * [hash:10]：去图片的 hash 的前 10 位
           * [ext]：取原来扩展名
           */
          name: '[hash:10].[ext]'
        }
      },
      {
        test: /\.html$/, // 匹配以 .html 结尾的文件
        // 处理 html 文件的 img 图片（负责引入 img，从而能被 url-loader 处理）
        use: 'html-loader'
      }
    ]
  },
  plugins: [
    // plugins 配置
    new htmlWebpackPlugin({
      template: "./src/index.html"
    })
  ],
  mode: 'development'
}