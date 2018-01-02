var express = require('express');//导入express框架
var app = express();//使用框架

//设置静态目录
app.use(express.static('public'));

//允许跨域
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    if(req.method=="OPTIONS") res.send(200);/*让options请求快速返回*/
    else  next();
});

//引入User模块
let User = new require("./models/model-user");
new User(app);

//引入Goods模块
let Goods = new require("./models/model-goods");
new Goods(app);

//默认的入口
app.get("/", function (req, res) {
    res.send("hello")
});

//监听的端口
app.listen(3000);