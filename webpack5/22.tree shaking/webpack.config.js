const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

/** 
 * 
 * 使用 tree shaking 来优化代码运行的性能
 * 
 * 场景假设：假设有一棵树，它有着活力（参与工作运行）的树叶，也有着枯萎（不参与工作运行）的树叶，
 *    好看的树叶需要保留下来（有用的代码），枯萎的树叶（无用的、没参加过的代码）需要外力（tree shaking）
 *    的帮忙让它们飘落下来。
 * 
 * tree shaking 的作用：去掉无用的、没有使用过的代码，让代码体积变得更小。
 * 
 * 使用 tree shaking 的前提条件：必须使用 ES6 模块化语法 和 必须开启 production 环境。
 *    满足这两种条件后就可以自动的对代码进行 tree shaking（执行 webpack 指令后）。
 * 
 * tree shaking 应用效果：
 *    执行 webpack 指令后，通过查看构建后的代码 build/built.[contenthash:10].js，我们可以发现没有使用过的
 *      代码（这里指的是 test.js 中没有使用的 count 方法）并没有被打包进这个 js 文件中。
 * 
 * 使用 tree shaking 需要注意的问题：在不同的版本中 tree shaking 有些许差异，可能会无意之间将我们的 CSS 等
 *    引入未使用的文件当做未经使用的代码给去除掉了。
 * 
 * 注意点：
 *    1.如果在 package.json 中配置 "sideEffects": false 则表示所有代码都没有副作用，都可以进行 tree shaking。
 *      这样做可能会把 CSS 或者 @babel/polyfill 这类引入但是未使用的文件给干掉（tree shaking）。
 *    2.如果在 package.json 中配置 "sideEffects": ["*.css","*.less","*.sass"]则表示这些文件资源不要进行 tree shaking。
 * 
 * 使用 tree shaking 来优化代码运行的性能总结：
 *    1.必要条件：使用 ES6 模块化语法和必须开启 production 环境。
 *    2.注意点：
 *      （1）如果在 package.json 中配置 "sideEffects": false 则表示所有代码都没有副作用，都可以进行 tree shaking。
 *          这样做可能会把 CSS 或者 @babel/polyfill 这类引入但是未使用的文件给干掉（tree shaking）。
 *      （2）如果在 package.json 中配置 "sideEffects": ["*.css","*.less","*.sass"]则表示这些文件资源不要进行 tree shaking。
 * 
*/


// 定义 nodejs 环境变量，决定使用 browserlist 的哪个环境，默认使用的是 生产环境 production
// 设置 nodejs 环境变量，让 css 兼容规格以开发环境的配置来做
process.env.NODE_ENV === 'production';

// 复用 loader
const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    // 还需要在 package.json 中定义 browserlist
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
    // 给打包构建后的 JS 文件名称设置哈希值
    // 设置哈希值并只取十位
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        enforce: 'pre', // 优先执行了
        // 下面用到了 oneOf：因为 oneOf 已经有了一个处理 JS 文件的 Loader
        // 所以这个 Loader 不能配置在 oneOf 规则下
        // oneOf 的规则是不能有两个配置处理同一类型的文件
        loader: 'eslint-loader',
        options: {
          fix: true, // 自动修复 eslint 的错误
        }
      },
      {
        // 注意：不能有两个配置处理同一类型的文件
        oneOf: [
          {
            test: /\.css$/,
            use: [...commonCssLoader]
          },
          {
            test: /\.less$/,
            use: [...commonCssLoader, 'less-loader']
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            // !!! tree shaking
            // tree shaking 可以应用到 package.json 中，要是想让业务代码生效的话 可以在 module.rules 里面添加
            // sideEffects: false,
            options: {
              // 预设：指示 babel 做怎么样的兼容性处理
              // 要告诉 'babel-loader' 要做怎么样的语法转换
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
                    // 指定兼容性做到哪个版本的浏览器
                    targets: {
                      chrome: '60',
                      firefox: '60',
                      ie: '9',
                      safari: '10',
                      edge: '17'
                    }
                  }
                ]
              ],
              // 开启 babel 缓存
              // 第二次构建时会读取之前的缓存数据
              cacheDirectory: true,
            }
          },
          {
            test: /\.(jpg|png|jpeg|gif)$/,
            loader: 'url-loader',
            options: {
              limit: 8 * 1024 * 1024,
              name: '[hash:10].[ext]',
              outputPath: 'imgs',
              esModule: false,
            }
          },
          {
            // 处理html中img资源
            test: /\.html$/,
            //处理 html 文件中 img 图片，负责引入 img，被 url-loaer 处理,下载 npm i html-withimg-loader -D
            loader: 'html-withimg-loader',
          },
          {
            exclude: /\.(js|css|less|html|jpg|png|jpeg|gif)/,
            loader: 'file-loader',
            options: {
              outputPath: 'media'
            }
          }
        ]
      },
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
    new MiniCssExtractPlugin({
      // 给打包构建后的 CSS 文件名称设置 hash 值
      filename: 'css/built.[contenthash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩 css
  ],
  mode: 'development',
  devtool: 'source-map'
}