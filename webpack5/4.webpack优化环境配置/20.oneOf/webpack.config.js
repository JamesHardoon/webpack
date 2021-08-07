const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 定义 nodejs 环境变量，决定使用 browserlist 中的哪个环境，默认使用的是 生产环境 production
process.env.NODE_ENV = 'production';

// 复用 loader
const commonCssLoader = [
  // 'style-loader',
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    ident: 'postcss', // 固定写法
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-preset-env')()
        ]
      }
    }
  },
];

module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'js/built.js',
    path: resolve(__dirname, 'build')
  },
  module: {
    rules: [
      /**
       * 生产环境基本配置 步骤：
       * 1.处理 css css-loader
       * 2.处理 less less-loader
       * 3.css 兼容性处理 postcss-loader
       * 4.less 兼容性处理 postcss-loader （postcss-loader 要放在 css-loader 和 less-loader 之间）
       * 5.复用 loader
       * 6.对 css 进行压缩，直接在 plugins 里面直接调用   optimize-css-assets-webpack-plugin
       * 7.对 eslint 对 js 进行语法检查 eslint，使用 airbnb 规则
       * 8.对 js 进行兼容性处理 babel-loader @babel/preset-env （按需加载）
       * 9.js 压缩，只有将 mode: production，就会自动压缩
       * 10.处理图片 url-loader，注意，url-loader 使用的是 es6 ,html-loader 使用的是 commonJS，所以在使用 url-loader 的时候，需要关闭 es6 模块(esModule: false)
       * 11.处理 html 资源，使用 插件 html-webpack-plugin
       * 12.处理 html 文件中的图片， 使用 html-loader
       * 13.压缩 html, 在 new HtmlWebpackPlugin 中加入 属性 minify
       * 14.处理 其他文件 file-loader
       */
      {
        // js 语法检查处理  在 package.json 中 的 eslintConfig 中进行配置
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        enforce: 'pre', // 所有 loader 中，优先执行
        options: {
          fix: true, // 自动修复 eslint 的错误
        }
      },
      {
        /**
         * 场景重现：在看完我们之前写过的Loader配置之后，我们需要注意如果我们我们不使用oneOf做优化的话，
         * 一个文件是需要被所有Loader的test给过滤检查一遍的(即在检查过滤中有些Loader的test处理不了这个文件，
         * 而有些Loader的test正好命中可以处理这个文件，但是该文件要把每一个Loader都走一遍)
         */
        // oneOf 可以提升构建速度
        // 以下 loader 只会匹配一个
        // 注意：不能有两个 loader 处理同一个 文件，比如 eslint-loader 和 babel-loader 都是处理 js 文件的，这样就不行，需要将 eslint-loader 提取出去
        oneOf: [
          {
            // css 处理
            test: /\.css$/,
            use: [
              ...commonCssLoader
            ]
          },
          {
            // less 处理
            test: /\.less$/,
            use: [
              ...commonCssLoader,
              'less-loader'
            ]
          },
          {
            // js 兼容性处理
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: {
                      version: 3, // 指定 core-js 版本
                    },
                    targets: { // 指定兼容性做到哪个版本浏览器
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
          },
          {
            // 图片处理
            test: /\.(jep|png|jpeg|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024, // 小于 8kb 转换为 base64,
              name: '[hash:10].[name].[ext]',
              compress: true, // 压缩
              esModule: false, // url-loader 采用的是 es6 规范, html 文件中的图片是 通过 html-loader 进行处理的，html-loader 采用的是 commonJS 规范，所以要关闭 esModule
              output: 'imgs', // 输出的图片文件夹
            }
          },
          {
            // html 文件的图片处理
            test: /\.html$/,
            loader: 'html-loader',
            /**
             * html-loader可以处理html中的img图片，可负责将其中的图片引入，然后交由url-loader进行解析
             */
            // options: {
            //   esModule: false
            // }
          },
          {
            exclude: /\.(html|js|css|less|jpg|png|jpeg|gif)$/,
            loader: 'file-loader',
            options: {
              name: '[hash:10].[name].[ext]', // 
              outputPath: 'media'
            },
          },
        ]
      }

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: { // 压缩 html 文件 配置
        collapseWithSpaces: true, // 压缩空格
        removeComments: true, // 移除 html 文件的注释
      }
    }),
    new MiniCssExtractPlugin({ // 提取 css 成一个单独的文件
      filename: 'css/built.css', // 对输出的 css 文件进行重命名
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩 css
  ],
  mode: 'production'
}