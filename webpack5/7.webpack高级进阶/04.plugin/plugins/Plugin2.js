
const path = require('path');
const util = require('util'); // node 工具类
const fs = require('fs'); // 读取文件 fs 里面是异步代码，可以通过 util.promisify() 改造成同步代码
const webpack = require('webpack');

// 快速创建基于 webpack 风格的文件
// 将 fs.readFile 变成基于 promise 的异步方法
const readFile = util.promisify(fs.readFile);

/**
 *  将 data 数据变成下面风格的数据：
 *  compilation.assets['a.txt'] = {
      size() {
        return content.length;
      },
      source() {
        return content;
      }
    }
 */
const { RawSource } = webpack.sources; // 在 webpack4 版本，sources 是一个库，需要瞎子啊引入，webpack5 之间改为 webpack 上的一个属性，直接调用即可


/**
 * 1、可以通过 compilation.assets['a.txt'] 形式 添加资源，缺点是 需要自己计算文件资源的大小和内容(size() source())
 * 
 * 2、还可以通过 读取文件的方式，往打包目录中添加文件资源
 *    需求：读取 pligins 文件目录下的 b.txt 然后输出到打包文件目录 dist 下
 */
class Plugin2 {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('Plugin2', (compilation, compilationParams) => {
      // debugger
      // console.log("compilation: ", compilation);
      // console.log("compilationParams: ", compilationParams);
      compilation.hooks.additionalAssets.tapAsync('Plugin2', async (cb) => {
        // debugger
        // console.log("additionalAssets_compilation: ", compilation);

        const content = 'hello plugin2';

        // 往要输出资源中添加一个 a.txt 文件
        // 读取文件 方式一 这种方式最繁琐，需要手动计算文件的大小和内容 只有 size 和 source 两个属性，局限性较大
        compilation.assets['a.txt'] = {
          // 文件大小
          size() {
            return content.length;
          },
          // 文件内容
          source() {
            return content;
          }
        }
        
        // 读取文件 方式二 这种方式比较灵活
        const data = await readFile(path.resolve(__dirname, 'b.txt')); // data 是文件的具体内容数据，是一个 buffer 
        compilation.assets['b.txt'] = new RawSource(data);

        // compilation.emitAsset() 方式也可以输出文件资源
        // 读取文件 方式三 这种方式也比较灵活
        const data1 = await readFile(path.resolve(__dirname, 'c.txt')); // data 是文件的具体内容数据，是一个 buffer 
        compilation.emitAsset('c.txt', new RawSource(data1)); // 参数1 为要输出的文件，参数2 为要输出文件的内容，这种方式等价于 方式二

        cb(); // 调用完 cb() 函数后，会在打包（npx webpack）后，会在 dist 文件目录下输出 a.txt, b.txt, c.txt 文件资源
      })
    })
  }
}

module.exports = Plugin2;