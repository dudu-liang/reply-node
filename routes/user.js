import express from 'express';
import formidable from 'formidable';
import user from '../mongodb/user';
import crypto from 'crypto';

const router = express.Router();

let registerUser = function(data,callback) {
    
        var userOne = new user(data);
    
        userOne.save(function(err,data) {
            if(err) {
                console.log(err);
            }else{
                console.log("用户创建成功");
                console.log(data);
                if(callback) callback();
            }
        });
}

let hashPW = function(userName, pwd){
    var hash = crypto.createHash('md5');
    hash.update(userName + pwd);
    return hash.digest('hex');
  }
  


//登录
router.post('/login',function(req,res) {

    let name = req.body.name;

    let password = req.body.password;

    console.log(1111);

    console.log(req.cookie);

    try{

        if(!name || name == "") {
            res.send({
                status : 201,
                message : '用户名字段不能为空'
            });
        }else if(!password || password == "") {
            res.send({
                status : 202,
                message : '密码字段不能为空'
            });
        }else{
            user.findOne({
                name : name,
                password : password
            },function(err,docs) {
                if(err) {
                    res.send({
                        status : 201,
                        message : '登录失败，请重试'
                    });
                }else{
                    let hash = hashPW(name, password);
                    res.cookie("account", {account: name, hash: hash}, {
                        maxAge: 86400000,
                        path : '/'
                    });
                    res.send({
                        status : 200,
                        message : '登录成功'
                    });
                }
            })
        }

    }catch(err) {
        res.send({
            status : 500,
            message : '登录系统出错'
        });
        return;
    }

});

//注册

router.post('/register',function(req,res) {


    let name = req.body.name;

    let username = req.body.username;

    let password = req.body.password;

    let query = {
        name : name,
        username : username,
        password : password
    }

    try {

        user.find({
            name : name
        },function(err,docs) {
            if(err) {
                res.send({
                    status : 501,
                    message : '查找用户失败'
                });
            }else{
                if(docs.length == 0) {
                    //注册用户
                    registerUser(query,function(data) {
                            let hash = hashPW(name, password);
                            res.cookie("account", {account: name, hash: hash}, {
                                maxAge: 86400000,
                                path : '/'
                            });
                            res.send({
                                status : 200,
                                message : '注册成功'
                            });
                    })
                }else{
                    res.send({
                        status : 500,
                        message : '用户名已存在'
                    });
                }
            }
        });
        
    } catch (error) {
        res.send({
            status : 500,
            message : '注册系统出错'
        });
        return;
    }
})

export default router;