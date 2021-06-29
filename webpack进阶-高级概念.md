# Webpack的高级概念

[TOC]



## 一. tree shaking

### 1.1 概念

> 在打包过程中，用来删除没有被使用到的文件，减小bundle.js的体积

### 1.2 使用

- **在生产环境下**
  
  - tree shaking默认已经配置好了，只需要添加如下配置即可
  - `sideEffects`配置的作用是，用来排除打包的时候，不需要使用 tree shaking的文件，
  - 当`sideEffects`设置为false的时候，是告诉webpack，所有文件都使用tree shaking
  
  ~~~json
   //package.json
  //...
  //sideEffects: ["*.css","./src/some.js"]
  "sideEffects":false
  ~~~
  

  
- **在开发环境下**

  - 需要我们手动配置 tree shaking

  ~~~js
  // webpack.config.js
  module.exports = {
      // ...
      optimization: {
          usedExports: true
      }
  }
  ~~~

  ~~~json
  //package.json
  "sideEffects": false
  ~~~

详情参考webpack官网：[tree-shaking](https://webpack.js.org/guides/tree-shaking/)

## 二. 开发和生产模式下的打包模式区分

> 可以分别配置开发和生产环境各自独立的配置文件
>
> 在打包的时候，通过package.json的scripts分别配置生产环境和开发环境各自的打包命令

~~~js
// webpack.common.js

const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
    entry: path.resolve(__dirname,'./src/index.js'),
    output:{
        path: path.resolve(__dirname,'./dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
        new htmlWebpackPlugin({
            title: 'prouction'
        })
    ]
}
~~~

~~~js
// webpack.dev.js
const common = require('./webpack.common')
const merge = require('webpack-merge')

module.exports = merge(common,{
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist'
    }
})
~~~

~~~js
// webpack.prod.js
const merge = require('webpack-merge')
const common = require('./webpack.common')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const webpack = require('webpack')

module.exports = merge(common,{
    mode: 'production',
    plugins: [
        new  UglifyJSPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_env': JSON.stringify('production')
        })
    ]
})
~~~

~~~json
// package.json

scripts:{
    "dev": "webpack-dev-server --config webpack.dev.js",
    "prod": "webpack --config webpack.prod.js"
}
~~~

详情参考Webpack官网：[development](https://webpack.js.org/guides/development/)

## 三. code splitting

> **作用：**代码分割，通过合理的代码分割，可以使代码性能更高
>
> **核心：**提取不会更改的核心内库，避免修改后重复加载，影响页面响应性能

**示例：**

~~~js
// webpack.config.js
module.exports = {
    optimization: {
        splitChunks:{
            chunks: 'all'
        }
    }
}  
~~~

详情参考webpack官网：[code splitting](https://webpack.js.org/guides/code-splitting/)

## 四. Caching

> **问题描述：**一般情况下，为了使页面在每次版本更新之后，都会主动加载最新的代码，我们在打包文件的时候，一般会给文件加上特定的版本号，这样虽然解决了加载旧缓存的问题，但是带来了一个新问题，由于文件名发生了变化，每次修改代码都会重新加载整个资源文件，导致网页性能变差。
>
> **思考：**资源文件中包含很多通用的代码，在打包的时候，提取运行时的文件（即通用的），将修改后需要重新加载的部分单独打包到一个文件，每次修改之后的更新，提取出来的运行时文件不变，这样可以使浏览器加载该文件的时候，直接从浏览器获取，提升页面性能

**使用方法：**

1. 修改输出文件名，为每一个打包之后的输出文件加上特有的hash值

~~~js
module.exports = {
    output:{
        path: path.resolve(__dirname,'./dist'),
        filename: '[name][contenthash].js'
    },
}
~~~

2. 将bundle.js中的运行时文件拆分为单独的文件（每次打包的时候，提取的运行时文件不发生变化，直接从缓存中取即可，不用重复加载）

~~~js
module.exports = {
     optimization: {
       runtimeChunk: 'single'
    }
}
~~~

3. 结合代码分割一起使用，提升界面性能

~~~js
module.exprots = {
    optimization: {
       runtimeChunk: 'single',
       splitChunks: {
           cacheGroups: {
               verdor: {
                   test: /[\\/]node_modules[\\/]/,
                   name: 'vendors',
                   chunks: 'all'
               }
           }
       }
    }
}
~~~

详情参考webpack官网：[Caching](https://webpack.js.org/guides/caching/)



## 五. webpack打包分析

- [webpack打包分析官网](https://github.com/webpack/analyse)

- 在官网中有介绍到，要使用webpack打包分析，首先得生成一个JSON文件,可通过如下命令打包生成

```shell
webpack --profile --json > stats.json
```

使用该命令打包之后，会在项目目录下面生成一个stats.json的文件，该文件包含打包的一些信息

打开官网中推荐的链接，选择刚刚打包生成的 stats.json文件，即可查看webpack的打包分析

**其它打包工具推荐**

- Webpack官网-----》 Guides  ------》 Code Splitting  ------》 BundleAnalysis
- 该目录下推荐了好几种Webpack打包分析，使用方法跟上述方法一样，选择stats.json文件即可
- 推荐：webpack-bundle-analyzer



## 六. Prefetching和Preloading

> **缓存解决的问题是：** 非首次加载代码的时候，浏览器直接从缓存中获取文件，从而减少请求，提升效率
>
> **webpack的优化并不满足于此**：Webpack希望第一次访问界面的时候，它的速度就是最快的（提升页面的代码使用率）
>
> 缓存带来的效率提升有限

**Prefetching和Preloading的作用**

- 首次加载的时候，只需要加载核心代码
- 在页面展示出来之后，即网络空闲的时候，加载后续界面调用需要用到的代码

**区别：**

- prefetching：在界面界面核心代码加载完成之后，空闲的时候加载文件
- preloading：和核心代码块一起加载

**使用：**

- webpack推荐使用异步加载的方法，更利于网页的优化
- 在`import`的文件路径前面加上 `/* webpackPrefetch: true */`即可使用prefetch
- 前提是使用了 babel模块支持ES6语法

```js
// index.js
//...
document.addEventListener('click', () =>{
	import(/* webpackPrefetch: true */ './click.js').then(({default: func}) => {
		func();
	})
});
```

```js
// click.js
function handleClick() {
	const element = document.createElement('div');
	element.innerHTML = 'Dell Lee';
	document.body.appendChild(element);
}

export default handleClick;
```



## 七. Css 代码分割

> 默认情况下，webpack打包的时候，会将CSS文件打包到js文件中
>
> **MiniCssExtractPlugin插件：**用来分割CSS代码，常用于线上打包环境

详细使用见webpack官网：[mini-css-extract-plugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)



## 八. Shimming

> 解决webpack打包过程中的兼容性问题

详见webpack官网：[shimming](https://webpack.js.org/guides/shimming/)



## 九. 环境变量的使用

> 在构建的命令行中传入 --env.production参数
>
> 在 webpack.common.js中根据参数判断打包类型

**使用：**

~~~json
// package.json

 "scripts": {
    "dev-build": "webpack --config ./build/webpack.common.js",
    "prod-build": "webpack --env.production --config ./build/webpack.common.js"
  },
~~~

~~~js
// webpack.common.js
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const prodConfig = require('./webpack.prod.js');
const commonConfig = {
	//...
}

module.exports = (env) => {
	if(env && env.production) {
		return merge(commonConfig, prodConfig);
	}else {
		return merge(commonConfig, devConfig);
	}
}

~~~



## 十. 编写一个Loader

### 10.1 同步loader

1. 新建文件夹，my-loader
2. 初始化文件夹：`npm init -y`

3. 在my-loader文件夹下新建loaders文件夹，存放我们的loader文件

   - 我们创建一个Loader，功能是替换掉我们js文件中的某个字符串
   - 新建 replaceLoader，文件内容如下

   ~~~js
   // replaceLoader.js
   // 
   module.exports = function(source){
       return source.replace('myname','world')
   
   }
   ~~~

   

4. 新建src文件夹

   - 新建index.js文件，随便写点代码，例如

   ~~~js
   // index.js
   
   console.log('hello myname')
   ~~~

5. 在项目目录下面新建 webpack.config.js 文件

   - 指定 mode以及打包入门和出口
   - 为js文件配置我们自己写好的loader

   ~~~js
   const path = require('path')
   
   module.exports = {
       mode: 'development',
       entry: {
           main: './src/index.js'
       },
       output: {
           path: path.resolve(__dirname,'./dist'),
           filename: '[name].js'
       },
       module: {
           rules: [
                       {
                           loader: path.resolve(__dirname,'./loaders/replaceLoader.js')
                       }
                   ]
               }
           ]
       }
   }
   ~~~

6. 最后打包文件，发现dist目录下的main.js文件中最终打印的事 hello world，即替换成功

### 10.2 异步loader

1. 在loader文件夹下创建 asyncReplaceLoad

   - 异步的loader文件入口

   ~~~js
   // asyncReplaceLoader
   
   const loaderutils = require('loader-utils')
   
   module.exports = function(source){
   
       const options = loaderutils.getOptions(this)
       const callback = this.async()
   
       setTimeout(()=>{
           const result = source.replace('Kobe',options.name)
           callback(null,result)
       },1000)
   
   }
   ~~~

2. 在 webpack.config.js文件中增加loader

   ~~~js
   const path = require('path')
   
   module.exports = {
       mode: 'development',
       entry: {
           main: './src/index.js'
       },
       output: {
           path: path.resolve(__dirname,'./dist'),
           filename: '[name].js'
       },
       module: {
           rules: [
               {
                   test:/\.js$/,
                   use: [
                       {
                           loader: path.resolve(__dirname,'./loaders/asyncReplaceLoader.js'),
                           options: {
                               name: 'world'
                           }
                       },
                       {
                           loader: path.resolve(__dirname,'./loaders/replaceLoader.js'),
                           options: {
                               name: 'Kobe'
                           }
                       }
                   ]
               }
           ]
       }
   }
   ~~~

   

## 十一. 编写一个Plugin

> 在本章，我们将介绍如何实现一个简单的plugin，让大家知道基本的实现的基本思路
>
> **插件功能：**在打包文件的时候，帮我们生成一个版本文件，记录我们的版本相关信息

**1. 创建文件夹，my-plugin，使用 npm init -y 命令初始化文件夹,并安装webpack和webpack-cli模块**

**2. 创建webpack.config.js，配置基本的webpack打包配置**

~~~js
// webpack.config.js
const path = require('path')

module.exports = {
    mode: 'development',
    entry: {
        main: path.resolve(__dirname,'./src/index.js')
    },
    output: {
        path: path.resolve(__dirname,'./dist'),
        filename: '[name].js'
    }
}
~~~

**3. 项目根目录创建 src文件夹，并在src文件夹下面创建index.js文件，用于测试**

~~~js
// index.js
console.log('hello world')
~~~

**4. 在项目根目录创建plugings文件夹，用来存储plugin文件**

**5. 在plugins文件夹下创建一个类（<font color=red>注意：这里不用于loader，loader是function，而plugin是一个类</font>）**

~~~js
// copyright-webpack-plugin.js

class CopyrightWebpackPlugin{
    // 如下为构造函数，可以通过 options参数获取plugin中传递过来的options参数，同时，在plugin被new的时候，会调用，在这里非必要，如果我们不显示声明，会有默认的构造函数
    // constructor(options){
    //     console.log(options)
    //     console.log('插件被使用了...')
    // }
	
    // 插件发生作用调用的方法，这里存在很多类似于生命周期的钩子函数，具体清参考webpack官网，documentation下的，API目录下的Plugins中的Compiler Hooks
    //这里实现的功能是，在打包完成之前，通过向compilation.assets对象中添加一个属性，来实现创建我们版本文件的目的
    apply(compiler){
        compiler.hooks.emit.tapAsync('Copyright-webpack-plugin',(compilation,callback)=>{
            compilation.assets['copyright.txt']={
                source: function(){
                    return 'copyright by mapengfei'
                },
                size: function(){
                    return 22
                }
            }
            callback()
        })
    }
}

module.exports = CopyrightWebpackPlugin
~~~

**6. 使用plugin**

~~~js
// webpack.config.js

const copyrightWebpackPlugin = require('./plugins/copyright-webpack-plugin')

module.exports = {
    //...
    plugins: [
        new copyrightWebpackPlugin()
    ]
}
~~~

