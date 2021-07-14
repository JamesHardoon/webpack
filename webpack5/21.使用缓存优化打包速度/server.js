/**
 * 服务器代码
 * 
 * 服务器启动命令：
 *    第一种方式：npm i nodemon -g  nodemon server.js
 *    第二种方式：node server.js
 * 
 * 访问服务器地址：http://localhost:9000
 *  
 */

const express = require('express');

const app = express();
// express.static 向外暴露静态资源
// maxAge 资源缓存的最大时间，单位 ms
app.use(express.static('build', { maxAge: 1000 * 3600 }));

app.listen(9000);