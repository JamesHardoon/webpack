const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// 设置 nodejs 的环境变量
process.env.NODE_ENV === 'development'

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
          MiniCssExtractPlugin.loader,
          'css-loader',
          /**
           * 使用 postcss 库 对 css 兼容性进行处理，postcss 要想在 webpack 中使用的话，需要使用一个 postcss-loader 和 插件 postcss-preset-env（帮助 postcss 识别某些环境，从而加载指定的配置，能让浏览器兼容性精确到某一个版本）
           * 使用 postcss-preset-env 这个插件帮助 postcss 找到 package.json 中的 browserslist 里面的配置，通过配置加载指定的 css 兼容性样式
           * 
           * 想了解更多关于浏览器兼容性问题，可以去 github 上搜索 关键字 "browserslist"
           * postcss 默认读取的是 开发环境（不看 webpack.config.js 中的 mode 模式），要想读取开发环境，需要在 webpack.config.js 中设置 node 环境变量: process.env.NODE_ENV = "development" 
           * 
           * "browserslist": {
           *    // 开发环境
           *    "development": [
           *      "last 1 chrome version", // 兼容最近的 Chrome 浏览器
           *      "last 1 firefox version", // 兼容最近的 firefox 浏览器
           *      "last 1 safari version", // 兼容最近的 safari 浏览器
           *    ],
           *    // 生产环境
           *    "production": [
           *      ">0.2%", // 兼容市面上 99.8% 的浏览器
           *      "not dead", // 不需要兼容已经死掉的浏览器
           *      "not op_mini all", // 不需要兼容 op_mini 浏览器
           *    ]
           * 
           * }
           */

          // 使用 postcss loader 有两种形式
          // 第一种：使用 loader 的默认配置
          'postcss-loader',

          // 第二种：需要修改 loader 的默=默认配置的话，需要使用对象的形式
          /**
           * !!! 注意：因为版本的原因，这里参照视频里面的写法打包会报错
           * 
          
          // !!! 以下这种写法会报错
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss', // 固定写法
              plugins: () => [
                // postcss 的插件
                require('postcss-preset-env')()
              ]
            }
          }

          // !!! 改成以下写法不报错，但是打包出来的 css 文件没有兼容性样式代码
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                ident: 'postcss', // 固定写法
                plugins: () => [
                  // postcss 的插件
                  require(postcss-preset-env)()
                ]
              }
              
            }
          }

          // !!! 改成以下写法不报错，打包出来的 css 文件也有兼容性样式代码
          {
            loader: 'postcss-loader',
            ident: 'postcss', // 固定写法
            options: {
              postcssOptions: {
                plugins: [
                  require('postcss-preset-env')()
                ],
              }
              
            }
          }

          // !!! 另一种解决方式：在 webpack.config.js 同级目录下创建 postcss.config.js 文件，在里面写上一下内容，
          // 将 webpack.config.js 文件中的其他配置去掉，改用默认配置 postcss-loader
          // 貌似这样写法使用的更多
          module.exports = {
            plugins: [
              // 使用 postcss 插件
              require('postcss-preset-env')
            ]
          }
          // !!! 在 postcss.config.js 文件中， 貌似这种写法也可以，建议使用这种
          module.exports = {
            plugins: {
              autoprefixer: {}
            }
          }
           */

          // {
          //   loader: 'postcss-loader',
          //   ident: 'postcss', // 固定写法
          //   options: {
          //     postcssOptions: {
          //       plugins: [
          //         require('postcss-preset-env')()
          //       ],
          //     }
          //   }
          // }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/built.css'
    })
  ],
  mode: 'development'
}