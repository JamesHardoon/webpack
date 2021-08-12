const { getOptions } = require('loader-utils')
const { validate } = require('schema-utils');
const babel = require('@babel/core'); // 使用 babel 的核心库 @babel/core 来编译
const util = require('util'); // nodejs 的工具函数

// babel.transform 用来编译代码的方法
// 是一个普通异步方法
// util.promisify 将普通异步方法转化成基于 promise 的异步方法
const transform = util.promisify(babel.transform);

// 定义 babelLoader 的校验规则
const babelSchema = require('./babelSchema.json')
/**
 * 这里是自定义的 loader
 * 为了跟 babel-loader 区分开，这里写成 babelLoader
 */
module.exports = function(content, map, meta) {
  // 获取 babelLoader 的 options 配置
  const options = getOptions(this) || {};
  // 校验 babelLoader 的 options 配置
  validate(babelSchema, options, {
    name: 'babelLoader'
  });

  // 创建 异步 loader
  const callback = this.async();

  // 使用 babel  编译代码
  transform(content,options)
  .then(({ code, map }) => callback(null, code, map, meta))
  .catch(err => callback(err))
}