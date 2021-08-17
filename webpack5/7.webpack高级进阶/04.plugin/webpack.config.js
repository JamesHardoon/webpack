
const Plugin1 = require('./plugins/Plugin1');
const Plugin2 = require('./plugins/Plugin2');
const CopyWebpackPlugin = require('./plugins/CopyWebpackPlugin');

module.exports = {
  plugins: [
    // new Plugin1(),
    // new Plugin2(),
    new CopyWebpackPlugin({
      from: 'public', // 复制的目录，从 public 目录开始
      to: 'css', // 不写默认是 .
      ignore: ['**/index.html'] // ignore: ['**/index.html'] 这样写能忽略 index.html 文件，['index.html'] 这样就不用忽略
    }),
  ]
}