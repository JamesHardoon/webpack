/*
  HMR: Hot Module Replacement 热模块替换/模块热替换
    作用：一个模块发生变化，只会重新打包这一个模块（而不是打包所以模块），极大提升构建速度

    样式文件：可以使用 HMR 功能：因为 style-loader 内部实现了~
    js 文件：默认不能使用 HMR 功能 
      解决：需要修改 JS 代码，添加支持 HMR 功能的代码
      注意：HMR 功能对 js 的处理，只能处理非入口 js 文件的其他 js 文件
    HTML 文件：默认不能使用 HMR 功能，同时会导致一个问题：html 文件不能热更新了（不用做 HMR 功能，因为只有一个 index.html 文件）
      解决：修改 entry 入口，将 html 文件引入，并重启 webpackentry: ['./src/js/index.js', './src/index.html']）

*/

const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/js/index.js', './src/index.html'], // entry 改为数组形式 可以使得 html 文件也能热更新
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "build")
  },
  module: {
    rules: [
      // loader的配置
      {
        // 处理less资源
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader']
      },
      {
        // 处理css资源
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        // 处理图片资源
        test: /\.(jpg|png|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:8].[name].[ext]',
          compress: true,
          // 关闭es6模块化
          esModule: false,
          outputPath: 'imgs'
        }
      },
      {
        // 处理html中img资源
        test: /\.html$/,
        //处理 html 文件中 img 图片，负责引入 img，被 url-loaer 处理,下载 npm i html-withimg-loader -D
        loader: 'html-withimg-loader',
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif)/,
        loader: 'file-loader',
        options: {
          name: '[hash:8].[name].[ext]',
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 8888,
    open: false,
    // 开启HMR功能
    // 当修改了webpack配置即(修改了webpack.config.js的配置)
    // 新配置要想生效，必须重新 webpack 服务
    // (重新执行npx webpack serve指令
    hot: true,
  },
  target: 'web',
}