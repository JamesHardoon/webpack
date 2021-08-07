const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      /**
       * js 兼容性处理：
       *    使用 babel-loader
       *    需要下载的插件有：babel-loader @babel/core @babel/preset-env
       * 
       * 1.基本的兼容性处理：使用 @babel/preset-env
       *  问题：只能转换基本语法，如 Promise 等高级语法不能转换，则不能被转换
       * 2.全部兼容性处理，需要使用到 @babel/polyfill 包进行全部的兼容性处理
       *  只需要在 index.js 文件中引入即可 （import '@babel/polyfill';）
       *  问题：我只有解决部分兼容性问题，但是将所有的兼容性代码全部引入，体积太大了~
       * 3.需要做兼容性处理的就做：按需加载，需要使用到 core-js 库 （推荐使用这种）
       *    注意：使用第三种方案时，就需要将第二种方案注释掉（将 index.js 中的 import '@babel/polyfill'; 注释掉）
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示 babel 做怎样的兼容性处理
          // 使用方式二的话打开这里的代码以及将 index.js 中的 import '@babel/polyfill'; 打开，并且关闭下面 方式三 的代码
          // presets: ['@babel/preset-env']

          // 方式三
          // 使用 core-js 需要将这里改造一下
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定 core-js 版本
                corejs: {
                  version: 3
                },
                // 指定兼容性做到哪个版本浏览器
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
            ]
          ]
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  mode: 'development'
}