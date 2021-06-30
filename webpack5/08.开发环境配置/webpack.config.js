const { resolve } = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/js/index.js",
  output: {
    filename: "js/built.js",
    path: resolve(__dirname, "./build")
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader','css-loader','less-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader',
        options: {
          limit: 8 * 1024,
          esModule: false,
          name: '[hash:10].[ext]',
          outputPath: 'imgs'
        }
      },
      {
        exclude: /\.html$/,
        loader: 'html-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      },
      {
        exclude: /\.(css|js|html|less|png|svg|jepg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]',
          outputPath: 'media'
        }
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
  mode: 'development',
  devServer: {
    contentBase: resolve(__dirname, 'build'),
    compress: true,
    port: 3000,
    open: true
  }
}