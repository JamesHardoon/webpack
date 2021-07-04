const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 定义 nodejs 环境变量，决定使用 browserlist 的哪个环境
process.env.NODE_ENV = 'production';

// 复用 loader
const commonCssLoader = [
  // 'style-loader', //  MiniCssExtractPlugin.loader 来代替 style-loader, 因为 style-loader 不能 style-loader 不能提取 js 中的 css 成单独的文件， MiniCssExtractPlugin.loader 可以
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // css 兼容性处理, 使用 postcss-loader
    // 还需要在 package.json
    loader: 'postcss-loader',
    ident: 'postcss', // 固定写法
    options: {
      postcssOptions: {
        plugins: [
          require('postcss-preset-env')()
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
      // css
      {
        test: /\.css$/,
        use: [
          ...commonCssLoader,
        ]
      },
      // less
      {
        test: /\.less$/,
        use: [
          ...commonCssLoader,
          'less-loader'
        ]
      },

      /**
       * 正常来讲，一个文件只能被一个 loader 处理，
       * 当一个文件要被多个 loader 处理时，一定要指定 loader 执行的先后顺序，
       * 先执行 eslint，再执行 babel
       */
      // eslint
      {
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
          esModule: false, // 因为 url-loader 采用的是 commonJS，所以需要关闭 es 模块
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
      template: './src/index.html',
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