const path = require('path');
const fs = require('fs');
const { promisify } = require('util')

const { validate } = require('schema-utils');
const globby = require('globby'); // 专门用来匹配文件列表，并且可以根据自己的规则来忽略掉一些文件
const webpack = require('webpack');

const schema = require('./schema.json');
const { Compilation } = require('webpack');

const readFile = promisify(fs.readFile); // 基于 promise 的方法
const { RawSource } = webpack.sources

/**
 * CopyWebpackPlugin 插件
 *    功能：将 public 文件夹内除了 index.html 文件以外的其他文件全部复制到 dist 目录下
 * 
 */
class CopyWebpackPlugin {
  constructor(options = {}) {
    // 验证 options 是否符合规范
    validate(schema, options, {
      name: 'copyWebpackPlugin',
    })
    this.options = options;
  }

  apply(compiler) {
    // 初始化 compilation
    compiler.hooks.thisCompilation.tap('CopyWebpackPlugin', (compilation) => {
      // 添加资源的 hooks
      compilation.hooks.additionalAssets.tapAsync('CopyWebpackPlugin', async (cb) => {
        /**
         * 将 from 中的资源复制到 to 中，输出出去
         * 1. 读取 from 中的所有资源
         * 2. 过滤掉 ignore 的文件
         * 3. 生成 webpack 格式的资源
         * 4. 添加 compilation 中，输出出去
         * 
         */
        // 将from中的资源复制到to中，输出出去
        const { from, to = '.', ignore } = this.options;
        // const to = this.options.to ? this.options.to : '.';

        // context 就是 webpack 配置
        // 运行指令目录
        const context = compiler.options.context; // process.cwd()
        console.log('context: ', context);
        // 将输入路径变成绝对路径
        // path.resolve(context, from) 以执行上下文目录为基准
        const absoluteFrom =  path.isAbsolute(from) ? from : path.resolve(context, from); // 不是绝对路径的话就根据 运行指令的目录为根目录拼接路径

        // 1. 过滤掉ignore的文件
        // globby(要处理的文件夹，options)
        const paths = await globby(absoluteFrom, { ignore }); // 参数1：要处理的文件夹，必须是绝对路径，参数2：是一个对象 options

        console.log("paths: ", paths); // 所有要加载的文件路径数组

        // 2. 读取paths中所有资源
        const files = await Promise.all(
          /**
           * map 方法遇到 async 并不会等一个执行完再去执行另一个，这样就会出问题，文件没读取完，下面的代码就执行完了
           * 
           * 解决方法：采用 Promise.all 接收一个数组，数组中是 n 个 promise 对象，map 返回的是一个数组，加上 async 返回的就是一个 promise 数组
           *  而 Promise.all 是等数组中的所有 promise 对象都变成成功状态才继续执行
           * 
          */
          paths.map(async (absolutePath) => {
            // 读取文件
            const data = await readFile(absolutePath);
            // basename 得到最后的文件名称
            const relativePath = path.basename(absolutePath);
            // 和to属性结合
            // 没有to --> reset.css
            // 有to --> css/reset.css
            const filename = path.join(to, relativePath);

            return {
              data, // 文件数据
              filename // 文件名称
            }
          })
        )

        // 3. 生成webpack格式的资源
        const assets = files.map((file) => {
          const source = new RawSource(file.data);
          return {
            source,
            filename: file.filename
          }
        })

        // 4. 添加compilation中，输出出去
        assets.forEach((asset) => {
          compilation.emitAsset(asset.filename, asset.source);
        })

        cb();
      })
    })
  }
}

module.exports = CopyWebpackPlugin;