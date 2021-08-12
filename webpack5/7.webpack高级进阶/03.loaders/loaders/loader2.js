// loader 本质是一个 函数

/**
 * 异步 loader 方式
 * @param {*} null 表示没有错误
 * @param {*} content callback() 处理后的内容
 * @param {*} map 文件 source-map 的映射信息，可选值，一般不传
 * @param {*} meta 文件的元信息，可选值，一般不传
 * 
 * 注意：使用 async() 不需要 return
 */
module.exports = function(content, map, meta) {
  console.log(222);
  const callback = this.async();
  setTimeout(() => {
    // 使用 this.async() loader 会停止执行，只有调用 callback 时，才会继续执行 
    callback(null, content, map, meta);
  }, 1000)
}

//  loader 上定义的方法的执行顺序是 从上往下执行
module.exports.pitch = function() {
  console.log('pitch 222');
}