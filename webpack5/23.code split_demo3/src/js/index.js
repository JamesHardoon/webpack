
/**
 * 通过 js 代码，让某个文件本单独打包成一个 chunk
 * 这个是 import 动态导入语法，能将 某个 js 文件单独打包成一个 chunk
 * webpackChunkName: 'test'：表示打包后的名字
 */
import(/* webpackChunkName: 'test'*/'./test')
  .then(({mul, count}) => {
    // eslint-disable-next-line
    console.log(mul);
    console.log(count)
  })
  .catch(() => {
    // eslint-disable-next-line
    console.log('文件加载失败~~')
  })

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));

function add(x, y) {
  return x + y;
}

// 下一行 eslint 所有规则都失效（下一行不进行 eslint 检查）
// eslint-disable-next-line
console.log(add(5, 6));
