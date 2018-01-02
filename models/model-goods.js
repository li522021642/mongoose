//引用公共的连接
require('../common/connect');
//引用模块
let mongoose = require('mongoose');
//post请求需要的中间件
var bodyParser = require('body-parser');
// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({extended: false});

/**
 * Goods类
 */
class Goods {
    //构造函数，new关键字的时候，会自动执行
    constructor(app) {
        //创建自己的模型
        let schema = new mongoose.Schema({
            name: String,       //名字
            price: String,      //价格
            number: Number,     //数量
            message: String,    //简介
            image: String,        //图片
            type: Number        //分类
        });
        //连接的表
        this.temp = mongoose.model('goods', schema);
        this.app = app;

        //文件上传需要
        var fs = require("fs");
        var multer  = require('multer');
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(multer({ dest: '/tmp/'}).array('image'));

        /**
         * 添加商品
         */
        this.app.post("/addGoods", urlencodedParser, (req, res) => {
            let newGoods = {
                name: req.body.name,
                price: req.body.price,
                number: req.body.number,
                message: req.body.message,
                image: req.files[0].originalname,
                type: req.body.type
            };
            let des_file = __dirname + "/public/images/" + req.files[0].originalname;
            fs.readFile( req.files[0].path, (err, data) => {
                fs.writeFile(des_file, data, (err) => {
                    this.addGoods(newGoods, res);
                });
            });
        });

        /**
         * 获取所有商品
         */
        this.app.get("/getAllGoods", (req, res) => {
            this.getAllGoods(res);
        })

        /**
         * 修改商品
         */
        this.app.post("/updateGoods", urlencodedParser, (req, res) => {
            let upGoods = {
                name: req.body.name,
                price: req.body.price,
                number: req.body.number,
                message: req.body.message,
                image: req.files[0].originalname,
                type: req.body.type
            };
            this.updateGoods(upGoods, res);
        })

        /**
         * 分页查询商品
         */
        this.app.post("/getGoodsLimit", urlencodedParser, (req, res) => {
            let mSkip = req.query.page;  //传递过来的页数
            mSkip = (mSkip-1) * 5;
            this.getGoodsLimit(mSkip, res);
        })

        /**
         * 删除商品
         */
        this.app.post("/deleteGoods", urlencodedParser, (req, res) => {
            let goodsName = req.body.name;
            this.deleteGoods(goodsName, res);
        })

    }
    
    /**
     * 获取所有商品
     * @param res
     */
    getAllGoods(res) {
        this.temp.find(null, {_id: 0, __v: 0}, (err, doc) => {
            res.json({
                code: 200,
                message: "成功",
                result: doc
            })
        })
    }

    /**
     * 添加商品
     * @param newUser
     * @param res
     */
    addGoods(newGoods, res) {
        //查询数据库里面是否存在该用户
        this.temp.find({name: newGoods.name}, (err, doc) => {
            if (doc.length != 0) {
                res.json({
                    code: 500,
                    message: "该商品已存在"
                })
            } else {
                //如果没有查询到该用户，就注册
                new this.temp(newGoods).save( (err, doc) => {
                    res.json({
                        code: 200,
                        message: "添加成功"
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
    updateGoods(upGoods, res) {
        this.temp.update({name: upGoods.name}, upGoods, (err, doc) => {
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
    getGoodsLimit(mSkip, res) {
        this.temp.find(null, {_id: 0, __v: 0}).skip(mSkip).limit(5).exec( (err, doc) => {
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
    deleteGoods(goodsName, res) {
        this.temp.findOneAndRemove({name: goodsName}, (err, doc) => {
            res.json({
                code: 200,
                message: "删除成功"
            })
        })
    }
}

//导出
module.exports = Goods;