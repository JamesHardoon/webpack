import { mul } from './test';

// 副作用可能（是可能不是绝对）将我们引入的 CSS 代码给 tree shaking 掉了
import '../css/iconfont.css';
import '../css/index.less';

function sum(...args) {
  return args.reduce((p, c) => p + c, 0);
}

// eslint-disable-next-line
console.log(mul(2, 3)); // 只是使用了 test.js 中导出的 mul 方法
// eslint-disable-next-line
console.log(sum(1, 2, 3, 4));

function add(x, y) {
  return x + y;
}

// 下一行 eslint 所有规则都失效（下一行不进行 eslint 检查）
// eslint-disable-next-line
console.log(add(5, 6));
