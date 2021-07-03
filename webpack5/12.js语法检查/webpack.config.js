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
       * 语法检查：eslint
       *    在 webpack 中使用 eslint，需要使用 eslint-loader，而且 eslint-loader 依赖于 eslint，所以要下载 eslint 和 eslint-loader 两个插件
       * 
       * 
       * 注意：语法检查只检查自己写的代码，不检查第三方库的代码，比如 node_modules 中的 js 代码
       * 
       * 设置检查规则：
       *  在 package.json 中的 eslintConfig 中进行配置，推荐使用 airbnb 规则
          "eslintConfig": {
            "extends": "airbnb-base" // 继承自 airbnb-base 库
          }
       *  airbnb 库有分为 eslint-config-airbnb-base（包含 es6 语法）和 eslint-config-airbnb-base/legacy（只包含 es5 和 es5 以下语法），
       *  airbnb 有 eslint-config-airbnb-base 和 eslint-config-airbnb（包含 react 风格建议）两种风格
       * 
       * 为了使用 eslint 库，需要下载 eslint 和 eslint-loader,
       * 为了使用 airbnb 规则，需要下载 eslint 和 eslint-config-airbnb-base 以及 eslint-plugin-import
       * 
       * eslint eslint-loader eslint-config-airbnb-base eslint-config-airbnb-base eslint-plugin-import
       * 
       * 
          "eslintConfig": {
            "extends": "airbnb-base"
          }
       * 
       * 
       */
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          // 自动修复 eslint 的错误
          fix: true
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