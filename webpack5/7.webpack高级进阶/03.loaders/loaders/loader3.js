// loader 提供的工具
const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');

// validate 的校验规则
const schema = require('./schema');
/**
 * 
 * @param {*} content 文件的内容
 * @param {*} map 文件 source-map 的映射信息
 * @param {*} meta 文件的元信息
 */
module.exports = function(content, map, meta) {
  console.log(333);
  // 获取 loader3 中的 options 配置
  const options = getOptions(this);
  console.log(333, options);
  // 校验 options 是否合法，成功则继续往下执行，失败则退出，并提示相应的错误
  validate(schema, options, {
    name: 'loader3'
  })
  return content;
}

//  loader 上定义的方法的执行顺序是 从上往下执行
module.exports.pitch = function() {
  console.log('pitch 333');
}