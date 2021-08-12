// loader 本质是一个 函数

/**
 * 同步 loader 方式，写法一
 * @param {*} content 文件的内容
 * @param {*} map 文件 source-map 的映射信息
 * @param {*} meta 文件的元信息
 */
// module.exports = function(content, map, meta) {
//   console.log(111);
//   return content; 
// }

/**
 * 同步 loader 方式，写法二
 * @param {*} null 表示没有错误
 * @param {*} content callback() 处理后的内容
 * @param {*} map 文件 source-map 的映射信息，可选值，一般不传
 * @param {*} meta 文件的元信息，可选值，一般不传
 * 
 * 注意：使用 callback() 不需要 return
 */
module.exports = function(content, map, meta) {
  console.log(111);
  this.callback(null, content, map, meta);
}


//  loader 上定义的方法的执行顺序是 从上往下执行
module.exports.pitch = function() {
  console.log('pitch 111');
}