console.log('index 文件被加载了~~');

// import { mul } from './test';

document.getElementById('btn').onclick = function() {
  // 懒加载 import('./tets').then().catch()   当文件需要使用时才加载
  // 预加载 webpackPrefetch：会在使用之前提前加载 js 文件

  // 正常加载可以认为是并行加载（同一时间加载多个文件）
  // 预加载 prefetch：是等其他资源都加载完毕，浏览器空闲了，再偷偷加载资源，缺点：兼容性差
  import(/* webpackChunkName: 'test', webpackPrefetch: true */'./test').then(({ mul }) => {
    console.log(mul(5, 9));
  }).catch(() => {

  })
}
