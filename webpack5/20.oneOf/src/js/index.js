// 引入
import '../css/iconfont.css';
import '../css/index.less';

function add(x, y) {
  return x + y;
}

// 下一行 eslint 所有规则都失效（下一行不进行 eslint 检查）
// eslint-disable-next-line
console.log(add(1, 2));
