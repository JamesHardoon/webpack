const myWebpack = require('../lib/myWebpack');
const config = require('../config/webpack.config');

// 1.初始化 compiler: new myWebpack(config) 得到 compiler 对象
const compiler = myWebpack(config);

// 2.调用 compiler 对象的 run 方法，开始打包 webpack
compiler.run();