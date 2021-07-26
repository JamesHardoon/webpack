import $ from 'jquery';

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
console.log($);
