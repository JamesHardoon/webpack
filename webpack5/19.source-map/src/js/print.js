
console.log('print 文件被加载了~~');

function print() {
  const content = 'hello print HMR';

  // 写出错误的 js 代码，用于 source-map 调试
  console.log(content)();
}

export default print;