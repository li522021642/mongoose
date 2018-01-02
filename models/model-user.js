//引用公共的连接
require('../common/connect');
//引用模块
let mongoose = require('mongoose');
//post请求需要的中间件
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false});

/**
 * User类
 */
class User {
    //构造函数，new关键字的时候，会自动执行
    constructor(app) {
        //创建自己的模型
        let schema = new mongoose.Schema({
            name: String,
            password: String,
            phone: String,
            email: String,
            age: Number,
            sex: Number,
            address: String
        });
        //连接的表
        this.temp = mongoose.model('user', schema);
        this.app = app;

        /**
         * 查询所有用户
         */
        this.app.get("/getAllUser", (req, res) => {
            this.getAllUser(res);
        });

        /**
         * 用户注册的接口
         */
        this.app.post("/insertUser", urlencodedParser, (req, res) => {
            let newUser = {
                name: req.body.name,//获取页面传递过来的字段名为name 的数据
                password: req.body.password,//获取页面传递过来的字段名为password 的数据
                phone: req.body.phone,//获取页面传递过来的字段名为phone 的数据
                email: req.body.email,//获取页面传递过来的字段名为phone 的数据
            };
            //往数据库里面插入数据
            this.insertUser(newUser, res);
        });

        /**
         * 修改用户的接口
         */
        this.app.post("/updateUser", urlencodedParser, (req, res) => {
            let upUser = {
                name: req.body.name,//获取页面传递过来的字段名为name 的数据
                password: req.body.password,//获取页面传递过来的字段名为password 的数据
                phone: req.body.phone,//获取页面传递过来的字段名为phone 的数据
                email: req.body.email,//获取页面传递过来的字段名为phone 的数据
                age: req.body.age,
                sex: req.body.sex,
                address: req.body.address
            };
            //往数据库里面插入数据
            this.updateUser(upUser, res);
        });

        /**
         * 删除用户的接口
         */
        this.app.post("/deleteUser", urlencodedParser, (req, res) => {
            //获取到传递过来的用户名
            let username = req.body.name;
            this.deleteUser(username, res);
        });

        /**
         * 分页查询的接口,每次返回5条数据
         * 参数：page:页码
         */
        this.app.get("/getUserLimit", (req, res) => {
            let mSkip = req.query.page;  //传递过来的页数
            mSkip = (mSkip-1) * 5;
            this.getUserLimit(mSkip, res);
        });
    }

    /**
     * 获取所有用户
     * @param res
     */
    getAllUser(res) {
        this.temp.find(null, {_id: 0, __v: 0}, (err, doc) => {
            res.json({
                code: 200,
                message: "成功",
                result: doc
            })
        })
    }

    /**
     * 添加用户
     * @param newUser
     * @param res
     */
    insertUser(newUser, res) {
        //查询数据库里面是否存在该用户
        this.temp.find({name: newUser.name}, (err, doc) => {
            if(doc.length != 0){
                res.json({
                    code: 500,
                    message: "该用户已经注册"
                })
            }else{
                //如果没有查询到该用户，就注册
                new this.temp(newUser).save( (err, doc) => {
                    res.json({
                        code: 200,
                        message: "注册成功"
                    })
                });
            }
        })

    }

    /**
     * 修改用户
     * @param upUser 需要修改的用户的全部信息
     * @param res
     */
    updateUser(upUser, res){
        this.temp.update({name: upUser.name}, upUser, (err, doc) => {
            res.json({
                code: 200,
                message: "修改成功"
            })
        });
    }

    /**
     * 分页查询
     * @param mSkip
     * @param res
     */
    getUserLimit(mSkip, res){
        this.temp.find(null, {_id:0, __v:0}).skip(mSkip).limit(5).exec( (err, doc) => {
            res.json({
                code: 200,
                message: "成功",
                result: doc
            })
        })
    }

    /**
     * 删除用户
     * @param username
     * @param res
     */
    deleteUser(username, res){
        this.temp.findOneAndRemove({name:username}, (err,doc) => {
            res.json({
                code: 200,
                message: "删除成功"
            })
        })
    }
}

//导出
module.exports = User;