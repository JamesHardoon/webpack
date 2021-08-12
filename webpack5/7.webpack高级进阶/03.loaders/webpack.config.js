const path = require('path');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        // // loader: 'loader1', // 单个 loader
        // // 多个 loader，执行顺序是 从下往上
        // use: [
        //   'loader1',
        //   'loader2',
        //   {
        //     loader: 'loader3',
        //     options: { // 会根据 schema.json 中的规则来校验 options 中的内容是否合法
        //       name: 'jack',
        //       age: 18
        //     }
        //   }
        // ]

        // 使用自定义的 babelLoader
        loader: 'babelLoader',
        options: {
          presets: [ // 预设
            '@babel/preset-env'
          ]
        }
      }
    ]
  },
  // loader 的解析规则
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'loaders'), // 默认去 node_modules 下找，找不到再去自定义的 loaders 目录下
    ]
  },
  plugins: [

  ]
}