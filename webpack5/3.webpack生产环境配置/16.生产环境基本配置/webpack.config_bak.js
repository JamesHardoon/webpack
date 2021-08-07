const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 定义 nodejs 环境变量，决定使用 browserlist 的哪个环境，默认使用的是 生产环境 production
process.env.NODE_ENV = 'production'; 

// 复用 loader
const commonCssLoader = [
  //  MiniCssExtractPlugin.loader 来代替 style-loader, 因为 style-loader 不能提取 js 中的 css 成单独的文件， MiniCssExtractPlugin.loader 可以
  // 'style-loader', 
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // css 兼容性处理, 使用 postcss-loader
    // postcss-loader 还需要在 package.json 中定义 browserlist 来对浏览器做兼容性处理
    loader: 'postcss-loader',
    ident: 'postcss', // 固定写法
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-preset-env')() // 使用 postcss-preset-env 插件中的配置来对 css 做兼容性处理
        ]
      }
    }
  }
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
       * 6.对 css 进行压缩 optimize-css-assets-webpack-plugin
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
        // css
        test: /\.css$/,
        use: [
          ...commonCssLoader, 
        ]
      },
      {
        // less
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          // less-loader 是无法使用 postcss-loader 来做兼容性处理的，需要先使用 less-loader 将 less 文件转换成 css，之后再使用 postcss-loader 来做兼容性处理
          'less-loader'
        ]
      },

      /**
       * 正常来讲，一个文件只能被一个 loader 处理，
       * 当一个文件要被多个 loader 处理时，一定要指定 loader 执行的先后顺序，
       * 先执行 eslint，再执行 babel
       * 
       * 注意：先检查，再兼容
       * 1.eslint 是做语法检查的，语法出了问题，后面再做兼容性处理就没有意义了
       * 2.babel-loader 会将 es6 语法转换为 es5 语法，一旦经过 babel-loader 转换后，再使用 eslint 检查就会报语法错误
       * 3.可以在 eslint-loader 中加入属性 enforce: 'pre' 表示，不管 rules 中有多少 loader，eslint-loader 位置在哪里，eslint-loader 都是优先执行
       * 
       */
      {
        // eslint
        // 在 package.json 中 的 eslintConfig 中进行配置
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre', // 优先执行
        loader: 'eslint-loader',
        options: {
          fix: true, // 自动修复 eslint 的错误
        }
      },
      // js
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
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
      // 图片
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          name: '[hash:10].[ext]', // 取 hash 码的前 10 位，并保留原有的扩展名
          compress: true, // 压缩文件
          esModule: false, // 因为 webpack 采用的是 commonJS，所以需要关闭 es 模块
          output: 'imgs'
        }
      },
      // html
      {
        // 处理 html 文件中的 img 资源
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        // 处理其他资源
        exclude: /\.(html|js|css|less|jpg|png|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }

    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 指定 ./src/index.html 为模板来创建新的 html 文件
      minify: { // 压缩 html 文件 配置
        collapseWithSpaces: true, // 压缩空格
        removeComments: true, // 移除 html 文件中的注释
      }
    }),
    new MiniCssExtractPlugin({ // 提取 css 成一个单独的文件
      filename: 'css/built.css', // 对输出的 css 文件进行重命名
    }),
    // 压缩 css 
    new OptimizeCssAssetsWebpackPlugin(),
  ],
  // 生产环境下自动压缩 js 
  mode: 'production',
}