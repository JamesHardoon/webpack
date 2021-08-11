const { 
  SyncHook, // 普通钩子，出没出错都继续往下执行
  SyncBailHook, // 如果函数中 同步 钩子 有返回值，就会退出，不执行后面的 钩子，如果没有返回值则继续往下执行，通过 返回值来判断当前钩子有没有出错
  SyncWaterfallHook, // 瀑布流，在这个 钩子中可以注册 n 个钩子，上个钩子的返回值会给下一个钩子
  SyncLoopHook,
  AsyncParallelHook, // 异步并行执行，异步代码可以并行同时去工作，谁优先做完谁就先结束
  AsyncParallelBailHook, // 钩子函数中有返回值，最终也会中支
  AsyncSeriesHook, // 异步代码中 串行执行，一个执行完再执行另一个
  AsyncSeriesBailHook,
  AsyncSeriesWaterfallHook,
} = require('tapable');

class Lesson {
  constructor() {
    // 初始化 钩子（hooks） 容器
    this.hooks = { // 在 this 实例对象上添加一个 hooks 属性，这个属性的值是一个对象，在这个对象中注册 n 个钩子
      // 同步 hooks，任务会依次执行
      go: new SyncHook(['address']), // 会创建一个相应的钩子容器，这里的容器就是 go，其中['address'] 表示 函数中接收的参数
      // 一旦有 返回值 就会退出
      goBailHook: new SyncBailHook(['address']),

      // 异步钩子
      // AsyncParallelHook： 异步并行钩子
      leave: new AsyncParallelHook(['name', 'age']),
      // AsyncSeriesHook: 异步串行执行
      leaveAsyncSeriesHook: new AsyncSeriesHook(['name', 'age']),
    }
  }
  tap() { // 定义 tap 方法去使用定义好的容器
    // 往 hooks 容器中注册事件或者说添加回调函数
    this.hooks.go.tap('class0318', (address) => { // 通过 tap 绑定事件 class0318 是 go 容器中钩子的名字
      console.log('class0318', address);
    })
    // 这个容器中可以添加多个 钩子 函数
    this.hooks.go.tap('class0410', (address) => {
      console.log('class0410', address);
    })

    this.hooks.goBailHook.tap('goBailHookName1', (address) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      console.log('goBailHookName1', address);
      return 111; // 加上 reutrn 就不会执行下面的钩子了
    })
    this.hooks.goBailHook.tap('goBailHookName2', (address) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      console.log('goBailHookName2', address);
    })

    // 异步钩子的 第一种写法
    this.hooks.leave.tapAsync('leaveAsyncParallelHook', (name, age, cb) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      setTimeout(() => {
        console.log('leaveAsyncParallelHook', name, age);
        cb();
      }, 2000)
    })

    // 异步钩子的第二种写法
    this.hooks.leave.tapPromise('leaveAsyncParallelHook_promise', (name, age) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('leaveAsyncParallelHook_promise', name, age);
          resolve();
        }, 1000)
      })
    })

    // 异步钩子的 第一种写法
    this.hooks.leaveAsyncSeriesHook.tapAsync('leaveAsyncSeriesHook', (name, age, cb) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      setTimeout(() => {
        console.log('leaveAsyncSeriesHook', name, age);
        cb();
      }, 2000)
    })

    // 异步钩子的第二种写法
    this.hooks.leaveAsyncSeriesHook.tapPromise('leaveAsyncSeriesHook_promise', (name, age) => { // 正常执行，跟上面的 'class0318' 钩子没啥区别
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('leaveAsyncSeriesHook_promise', name, age);
          resolve();
        }, 1000)
      })
    })



  }
  start() {
    // 触发 hooks
    this.hooks.go.call('c318'); // 调用 call() 方法 触发 go 容器中的所有 钩子
    this.hooks.goBailHook.call('goBailHookName'); // 调用 call() 方法 触发 goBailHook 容器中的所有 钩子
    this.hooks.leave.callAsync('jack', 18, function() {
      // 代表所有 leave 容器中的函数触发完了，才触发这个回调函数
      console.log('end~~~~');
    });
    this.hooks.leaveAsyncSeriesHook.callAsync('jack', 18, function() {
      // 代表所有 leave 容器中的函数触发完了，才触发这个回调函数
      console.log('end~~~~');
    });
  }
}

const l = new Lesson();
l.tap(); // 注册
l.start(); // 触发