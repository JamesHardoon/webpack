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

/**
 * 1.eslint 不认识 window、navigator 全局变量
 *  解决：需要在 package.json 中 eslintConfig 配置中新增
 *  "env": {
 *    "browser": true, // 支持浏览器全局变量
 *  }
 * 2.serviceWorker 代码必须要运行在服务器上
 *  --> 方式一：使用 node.js 代码
 *  --> 方式二：下载插件 npm i serve -g  serve -s build  // build 是指要运行的目录，启动服务器，将 build 下的所有资源作为静态资源暴露出去
 */

// 下一行 eslint 所有规则都失效（下一行不进行 eslint 检查）
// eslint-disable-next-line
console.log(add(5, 6));

// 注册 serviceWorker
// 处理兼容性问题
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('sw 注册成功！');
      })
      .catch(() => {
        console.log('sw 注册失败！');
      });
  });
}
