/**
 * webpack.config.js webpack 的配置文件
 *  作用：指示 webpack 干哪些活（当你运行 webpack 指令时，会加载里面的配置）
 * 
 *  所有的构建工具都是基于 nodejs 平台运行的，模块化默认采用 commonjs.
 */

// resolve 是 nodejs 的方法 用来拼接 绝对路径
const { resolve } = require('path');

module.exports = {
  // webpack 配置

  // 入口
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名（输出到 build 文件夹中的 built.js 文件中）
    filename: 'built.js',
    // 输出路径
    // __dirname 是 nodejs 的变量，代表当前文件(webpack.config.js)的目录绝对路径
    path: resolve(__dirname, 'build')
  },
  // loader 的配置
  module: {
    rules: [
      // 详细的 loader 配置，不同的文件需要配置不同的 loader 进行处理
      {
        test: /\.css$/, // 匹配以 .css 结尾的文件
        use: [
          // use 数组中 loader 的执行顺序是：从右到左，从下到上，依次执行
          'style-loader', // 创建 style 标签，将 js 中的样式资源插入进去，然后添加到页面的 header 中生效
          'css-loader', // 将 css 文件变成 commonjs 模块加载到 js 中，里面的内容是样式字符串
        ]
      },
      {
        test: /\.less$/, // 匹配以 .less 结尾的文件
        use: [
          // use 数组中 loader 的执行顺序是：从右到左，从下到上，依次执行
          'style-loader', // 创建 style 标签，将 js 中的样式资源插入进去，然后添加到页面的 header 中生效
          'css-loader', // 将 css 文件变成 commonjs 模块加载到 js 中，里面的内容是样式字符串
          'less-loader', // 将 less 文件编译成 css 文件，注意需要下载 less 和 less-loader
        ]
      },
    ]
  },
  // plugins 的配置
  plugins: [
    // plugins 的详细配置
  ],
  // 模式
  mode: 'development', // 模式 只有 两种，开发模式 development 和 生产模式 production，生产模式会压缩代码，开发模式不会

}