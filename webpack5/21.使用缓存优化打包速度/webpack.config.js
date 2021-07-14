const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

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
    // !!! 给打包构建后的 JS 文件名称设置哈希值
    // 设置哈希值并只取十位
    filename: 'js/built.[contenthash:10].js',
    path: resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      /**
       * 使用 babel-loader 存在的问题：
       *    Babel 会对我们编写的 JS 代码 进行编译处理成浏览器能识别的语法，它的工作原理是
       *    ‘对所有的 JS 模块 都进行编译处理’，假如，有一万个 JS 模块，当我只改动其中一个
       *    JS 模块时，Babel 会对一万个 JS 模块都进行编译处理，这不是我们希望看到的结果。
       *    我们希望的是，只有改动的 JS 模块的代码才会被 Babel 重新编译处理，而其他未改动的
       *    JS 模块不要被 Babel 重新编译处理。
       * 解决方法：开启 Babel 缓存，使得速度更快。只需要开启 'babel-loader' 的 'cacheDirectory'即可。
       * 
       * 观察文件缓存效果：想要观察 文件资源缓存 的效果，我们使用的方式是 node.js 配合 express 新建一个服务器，详情参见 server.js
       * 
       * 设置缓存的好处：
       *    用户在缓存还没过期的时间内，访问改页面，页面被加载呈现在用户眼前的时间很快速
       * 
       * 设置缓存带来的问题：
       *    当我们需要改变源目录结构下的代码（例如 改变了 src/js/index.js 内的代码），然后 重新执行 webpack 命令后，在刷新 http://localhost:9000
       *    服务器页面时，我们会发现因为 缓存 的原因，导致 服务器页面没有得到 实时更新（即使是我们已经重新执行了 webpack 命令重新构建包）。
       * 
       * 设置缓存带来问题的原因：
       *    在我们设置了 文件资源缓存 时，在资源缓存的时间内是不会访问服务器的，而是直接读取本地的缓存。
       * 
       * 危险警告：
       *    在文件资源被强缓存期间，因为是直接读取本地的缓存，如果此时本地缓存中文某个文件出现了 BUG，则导致没办法通过服务器上的文件更新来解决。
       *    难道只能等强缓存时间过期才能解决这个问题吗？
       * 
       * 解决方案：
       *    给文件的资源名称做处理！！
       * 
       * 解决方案的思路：
       *    1.我们通过给文件资源的名称添加一种特殊的记号，当我们本地缓存的文件资源名称和服务器上缓存的文件资源名称一样时，再次请求这个文件时，让它直接读取本地的缓存资源。
       *    2.如果我们修改了服务器上的文件资源内容，则生成文件与本地文件资源名称不一样的文件资源名称，这个时候再次请求这个文件，本地的文件资源名称和服务器文件资源名称是不一样的，这时则去服务器去请求文件资源。
       *    3.使用 哈希值来给文件名称做标识。
       * 
       * 使用哈希值的原理：每一次使用 webpack 打包命令后自动构建的文件名称都不一样（每一次打包都会生成一个新的哈希值），因此服务器在请求该文件时发现文件名称发生改变时，会自动的去重新请求这个新的文件资源。
       * 
       * 使用哈希值的注意点：
       *    1.hash：每次 webpack 构建时会生成一个唯一的 hash 值。
       *        问题：因为 css 和 js 文件使用的是同一个 hash 值，会导致所有的缓存失效。但是可能我只改动了一个文件（例如只改动了 js 文件执行了 webpack 指令后服务器上缓存的所有文件都会失效）
       *    2.chunkhash：根据 chunk 生成的 hash 值。如果打包来源于同一个 chunk，那么 hash 值就一样。
       *        问题：js 和 css 文件的 hash 值还是一样的，因为 css 总是（这里也是）在入口文件 js 中被引入的，所以这种情况下它们依旧是用属于一个 chunk。（我们这里值规定了一个入口文件，即 src/js/index.js）。
       *    3.contenthash：根据文件的内容生成 hash 值。不同文件的 hash 值一定不一样。
       *        推荐使用 contenthash。
       * 
       * 使用缓存优化打包构建速度的总结：
       *    1.从 Babel 入手，对 Babel 进行缓存
       *      只需要开启 'babel-loader' 的 'cacheDirectory'
       *    2.文件资源缓存
       *      （1）配合开启服务器页面来查看文件资源缓存的效果
       *      （2）给打包构建后的文件名称中添加设置哈希值
       *          1）推荐使用 contenthash
       *          2）理解 hasht
       *          3）理解 chunkhash
       */
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
              // !!! 开启 babel 缓存
              // !!! 第二次构建时会读取之前的缓存数据
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
      // !!! 给打包构建后的 CSS 文件名称设置 hash 值
      filename: 'css/built.[contenthash:10].css'
    }),
    new OptimizeCssAssetsWebpackPlugin(), // 压缩 css
  ],
  mode: 'production',
  devtool: 'source-map'
}