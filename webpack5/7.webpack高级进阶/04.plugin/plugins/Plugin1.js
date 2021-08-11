/**
 * 插件是一个 类 需要 export 出去
 * 
 * 在 插件中最终都会调用 apply()，所有自定义的插件，功能都要写在 apply 中
 */

class Plugin1 {
  apply(compiler) { // 默认传入 compiler 对象，所以可以通过 complier对象 找到上面绑定的一些钩子，然后往钩子中塞入一些回调函数，从而让 webpack 在执行过程中，执行我们绑定的相应 钩子
    compiler.hooks.emit.tap('Plugin1', (compilation) => {
      console.log('emit.tap: ');
    });
    compiler.hooks.emit.tapAsync('Plugin1', (compilation, cb) => {
      setTimeout(() => {
        console.log('emit.Async: ');
        cb();
      }, 1000)
    });
    compiler.hooks.emit.tapPromise('Plugin1', (compilation) => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('emit.tapPromise: ');
          resolve();
        }, 1000)
      })
    });
    compiler.hooks.afterEmit.tap('Plugin1', (compilation) => {
      console.log('afterEmit.tap: ');
    });
    compiler.hooks.done.tap('Plugin1', (stats) => {
      console.log('done.tapp: ');
    });
  }
}

// 使用的是 commonJS，需要使用 module.exports 进行暴露
module.exports =  Plugin1;