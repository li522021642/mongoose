/**
 * 连接到lxx数据库
 */
//引入模块
var mongoose = require('mongoose');
//创建连接
var db = mongoose.connect("mongodb://localhost/lxx");
//监听
db.connection.on("error", function (error) {
    console.log("连接出错" + error);
});
db.connection.on("open", function () {
    console.log("连接成功");
});