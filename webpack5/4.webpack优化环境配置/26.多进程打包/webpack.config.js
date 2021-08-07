const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const WorkBoxWebpackPlugin = require('workbox-webpack-plugin');

/** 
 * PWA：Progressive Web App 渐进式网络开发应用程序（离线可访问）
 *  workbox --> workbox-webpack-plugin
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
            use: [
              /**
               * 开启多进程打包
               * 
               * 注意：进程启动大概要 600ms，进程通信也有开销，所以只有工作消耗时间比较长，才需要进程打包
               * 
               * thread-loader 也可以对其他 loader 进行多线程处理，用法跟这个一样，不过处理不好可能会造成打包时间更长（启动和进程通信都需要开销）
               * 所以一般针对 js 文件较多的项目使用
               * 
               */
              // 'thread-loader', // 不加 options 写法
              {
                loader: 'thread-loader',
                options: {
                  workers: 2 // 两个进程
                }
              },
              {
                loader: 'babel-loader',
                // !!! tree shaking
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
              }
            ],
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
    new WorkBoxWebpackPlugin.GenerateSW({
      /**
       * 1.帮助 serviceWorker 快速启动
       * 2.删除旧的 serviceWorker
       * 
       * 最终会生成一个 serviceWorker 配置文件
       * 
       * package.json 文件需要新增以下配置，表示支持浏览器的全局变量
          "eslintConfig": {
            "extends": "airbnb-base",
            "env": {
              "browser": true
            }
          },
       */
      clientsClaim: true,
      skipWaiting: true
    })
  ],
  mode: 'development',
  devtool: 'source-map'
}