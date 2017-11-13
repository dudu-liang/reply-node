import express from 'express';
import user from '../mongodb/user';
import ask from '../mongodb/ask';
import crypto from 'crypto';

const router = express.Router();

let registerUser = function(data,callback) {
    
        var userOne = new user(data);
    
        userOne.save(function(err,data) {
            if(err) {
                console.log(err);
            }else{
                if(callback) callback(data);
            }
        });
}

let hashPW = function(userName, pwd){
    var hash = crypto.createHash('md5');
    hash.update(userName + pwd);
    return hash.digest('hex');
}

let userFind = function(id,username,res,callback) {

    user.findById(id,function(err,docs) {

        if(err) {
            res.send({
                status : 203,
                message : '查询出错'
            }) 
        }else{
            let oldname = docs.username;
            user.find({    
                "$and" :  [ {'username' : {$ne:oldname}} , {'username':username} ] 
            },function(uerror,udocs) {

                console.log(udocs);

                if(uerror) {
        
                    res.send({
                        status : 202,
                        message : '查询出错'
                    })
                    
                }else{
        
                    if(udocs.length != 0) {
                        res.send({
                            status : 203,
                            message : '昵称已存在'
                        })
                    }else{
                       if(callback) callback();
                    }
                }
            })
        }
    })

}

let userMessage = async function(userId,callback) {

    let unreqNumer = await ask.count({
            reply_id : userId,
            status : 1
        });
    
    let askNumber = await ask.count({
            ask_id : userId
        });

    let answerNumber = await ask.count({
        reply_id : userId,
        status : 2
    });

    if(callback) callback(unreqNumer,askNumber,answerNumber);

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
            user.find({
                name : name,
                password : password
            },function(err,docs) {
                if(err) {
                    res.send({
                        status : 201,
                        message : '登录失败，请重试'
                    });
                }else{
                    if(docs.length != 0) {
                        let hash = hashPW(name, password);
                        res.cookie("account", {account: name, hash: hash}, {
                            maxAge: 86400000,
                            path : '/'
                        });
                        res.send({
                            status : 200,
                            data : {
                              "id" : docs[0]._id
                            },
                            message : '登录成功'
                        });
                    }else{
                        res.send({
                            status : 202,
                            message : '用户名或密码错误'
                        });
                    }
                    
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
                                data : {
                                    "id" : data._id
                                },
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
});

//用户列表
router.get('/list',function(req,res) {

     try {

        user.find({},function(err,docs) {
            if(err) {
                res.send({
                    status : 201,
                    message : '用户查询出错'
                })
            }else{
                res.send({
                    status : 200,
                    message : '获取用户列表成功',
                    data : docs
                })
            }
        })
         
     } catch (error) {
         res.send({
             status : 500,
             message : '获取用户列表失败'
         })
     }
});

//获取单个用户信息
router.get('/query',function(req,res) {

    try {

        let userId = req.query.id;

        if(!userId) {
            throw new "缺少用户id参数";
        }

        user.findOne({
            "_id" : userId
        },function(err,docs) {

            if(err) {

                res.send({
                  status : 201,
                  message : '查询用户失败'
                });

            }else{

                res.send({
                    status : 200,
                    message : '获取用户成功',
                    data : docs
                })
            }
        })
        
    } catch (error) {
        res.send({
            status : 500,
            message : '系统出错'
        })
    }
});

//修改个人资料
router.post('/update',function(req,res) {

    try {
        let username = req.body.username;
        let description = req.body.description;
        let userId = req.body.id;

            if(!username) {

                throw new "缺少username参数";

            }

            if(!description) {
                
                throw new "缺少description参数";

            }


            userFind(userId,username,res,function() {
                 
                user.findByIdAndUpdate(userId,{
                    username : username,
                    description : description
                },function(err,docs) {
                    if(err) {
                        res.send({
                            status : 201,
                            message : '用户资料更新出错'
                        });
                    }else{
                        res.send({
                            status : 200,
                            message : '资料修改成功'
                        })
                    }
                })

            });
            
            
        
    } catch (error) {

        res.send({
            status : 500,
            message : '系统出错'
        });
    }
});

//获取个人主页信息
router.get('/message',function(req,res) {
    
        try {
    
            let userId = req.query.id;
    
            if(!userId) {
                throw new "缺少用户id参数";
            }
    
            user.findOne({
                "_id" : userId
            },function(err,docs) {
    
                if(err) {
    
                    res.send({
                      status : 201,
                      message : '查询用户失败'
                    });
    
                }else{

                    userMessage(userId,function(unreqNumer,askNumber,answerNumber) {

                        let copy = {
                            unreqNumer,
                            askNumber,
                            answerNumber
                        }
                        let result = Object.assign({},docs._doc,copy);

                        console.log(result);

                        res.send({
                            status : 200,
                            message : '获取用户成功',
                            data : result
                        });
                    });
    
                    
                }
            })
            
        } catch (error) {
            res.send({
                status : 500,
                message : '系统出错'
            })
        }
    });


export default router;