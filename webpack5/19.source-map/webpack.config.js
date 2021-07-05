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
  // target: 'web',
  devtool: 'cheap-module-source-map',
}

/*
  soure-map：是一种提供 源代码到构建后的代码映射 技术（如果构建后代码出错了，通过映射可以追踪源代码错误）

  [inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map

  1.source-map 外部
    特点：
      1.能够提供错误代码准确信息和源代码的错误位置

  2.inline-source-map 内联
    特点：
      1.只生成一个内联的 source-map，并且以 base64 的方式写在构建后输出的 js 代码中
      2.而且能够提供错误代码准确信息和源代码的错误位置

  3.hidden-source-map 外部
    特点：
      1.能够提供错误代码错误原因，但是没有提供源目录代码的错误位置信息(他的错误位置提示的是构建后输出的.js中的错误位置,我们想要的错误位置是构建前的源代码错误位置)
      2.不能追踪源代码错误，只能提示到构建后代码的错误位置

  4.eval-source-map 内联
    特点：
      1.每一个文件都生成对应的 source-map，都在 eval 中
      2.能够提供错误代码准确信息和源代码的错误位置

  5.nosources-source-map 外部
    特点：
      1.能够提供错误代码准确信息, 但是没有任何源代码信息

  6.cheap-source-map 外部
    特点：
      1.能够提供错误代码准确信息和源代码的错误位置
      2.只能精确的行而不是列

  7.cheap-module-source-map 外部
    特点：
      1.能够提供错误代码准确信息和源代码的错误位置 
      2.它会将 loader 的 source map 也加入

  内联 和 外部的区别：
    1.外部成了文件，内联没有
    2.内联构建速度更快

  在开发环境下(即mode: 'development')我们更需要考虑速度快，调试更友好
    1.速度快(eval>inline>cheap>...)  eval-cheap-souce-map 和 eval-source-map
    2.调试更友好 souce-map 和 cheap-module-souce-map 和 cheap-souce-map
    3.总结可以使用:
      eval-source-map 和 eval-cheap-module-souce-map

  在生产环境下(即mode: 'production')我们更需要考虑源代码要不要隐藏、调试要不要更友好的问题
    注意点：内联会让代码体积变大，所以在生产环境不用内联

    1.source-map: 能够提供错误代码准确信息和源代码的错误位置
    2.cheap-module-souce-map: 能够提供错误代码准确信息和源代码的错误位置只能精确的行而不是列
    3.nosources-source-map: 全部隐藏
    4.hidden-source-map: 只隐藏源代码，会提示构建后代码错误信息
    5.总结可以使用
      以上四种(一般情况用source-map即可)

  使用source-map优化代码调试的总结：
    1.在开发环境下(即mode: 'development') --- eval-source-map
    2.在生产环境下(即mode: 'production') --- source-map

*/

