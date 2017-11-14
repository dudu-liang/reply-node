import express from 'express';
import ask from '../mongodb/ask';
import user from '../mongodb/user';

const router = express.Router();

var findUserName = function (userId,callback) {

    return new Promise((resolve, reject) => {

        user.findById(userId,function(err,data) {
            
            if(err) {
                throw new '查询用户名失败';
            }else{
                let info = {
                    username : data.username,
                    avatar : data.avatar
                }
                resolve(info);
            }
            
        })
    });

    
}


let saveAsk = async (replyId,askId,content,res) => {

    let replyData = await findUserName(replyId);
    let askData = await findUserName(askId);
    let data = {
        reply_id : replyId,
        ask_id : askId,
        reply_username : replyData.username,
        ask_username : askData.username,
        reply_avatar : replyData.avatar,
        ask_avatar : askData.avatar,
        content : content
    }

    var askOne = new ask(data);
    
        askOne.save(function(err,data) {
            if(err) {
                res.send({
                    status : 201,
                    message : '提问失败'
                })
            }else{
                res.send({
                    status : 200,
                    message : '提问成功'
                })
            }
        });
};

//新建问题
router.post('/save', (req,res) => {
    let replyId = req.body.replyId;
    let askId = req.body.askId;
    let content = req.body.content;

    try {

        if(!replyId) {
            throw new '缺少replyId参数';
        }

        if(!askId) {
            throw new '缺少askId参数';
        }

        if(!content) {
            throw new '缺少content参数';
        }

        saveAsk(replyId,askId,content,res);

    } catch (error) {

        res.send({
            status : 500,
            message : '系统出错'
        })
        
    }

});

//待回答问题列表

router.get('/waitList',function(req,res) {

    let userId = req.query.id;

        try {

            ask.find({
                reply_id : userId,
                status : 1
            },function(err,docs) {

                if(err) {
                    res.send({
                        status : 201,
                        message : '获取待回答列表失败'
                    });
                }else{
                    res.send({
                        status : 200,
                        message : '获取列表成功',
                        data : docs
                    })
                }
                
            });

        } catch (error) {

            res.send({
                status : 500,
                message : '系统出错'
            });
            
        }
})

//我的提问列表

router.get('/askList',function(req,res) {
    
        let userId = req.query.id;
    
            try {
    
                ask.find({
                    ask_id : userId
                },function(err,docs) {
    
                    if(err) {
                        res.send({
                            status : 201,
                            message : '获取待回答列表失败'
                        });
                    }else{
                        res.send({
                            status : 200,
                            message : '获取列表成功',
                            data : docs
                        })
                    }
                    
                });
    
            } catch (error) {
    
                res.send({
                    status : 500,
                    message : '系统出错'
                });
                
            }
    });

//我的回答列表

router.get('/answerList',function(req,res) {
    
        let userId = req.query.id;
    
            try {
    
                ask.find({
                    reply_id : userId,
                    status : 2
                },function(err,docs) {
    
                    if(err) {
                        res.send({
                            status : 201,
                            message : '获取待回答列表失败'
                        });
                    }else{
                        res.send({
                            status : 200,
                            message : '获取列表成功',
                            data : docs
                        })
                    }
                    
                });
    
            } catch (error) {
    
                res.send({
                    status : 500,
                    message : '系统出错'
                });
                
            }
    });

//回答问题

    router.post('/answer',function(req,res) {

        let id = req.body.id;

        let answer = req.body.answer;

        try {

            if(!id) {
                throw new '缺少id参数';
            };

            if(!answer) {
                throw new '缺少answer参数';
            }

            ask.update({_id:id},{$set:{answer:answer,status : 2}},function(err){
                
                if(err) {
                    res.send({
                        status : 201,
                        message : '回答失败'
                    });
                }else{
                    res.send({
                        status : 200,
                        message : '回答成功'
                    });
                }
            });
            
        } catch (error) {
            res.send({
                status : 500,
                message : '系统出错'
            });
        }
    });

//获取单个问题
router.get('/query',function(req,res) {

    let id = req.query.id;

    if(!id) {
        throw new '缺少id参数';
    }

    try {
        
        ask.findById(id,function(err,docs) {
            
            if(err) {
    
                res.send({
                    status : 201,
                    message : '获取问题详情失败'
                });
    
            }else{
    
                res.send({
                    status : 200,
                    message : '获取问题详情成功',
                    data : docs
                });
    
            }
            
        });

    } catch (error) {

        res.send({
            status : 500,
            message : '系统出错'
        })
        
    }
});

//首页问题列表

router.get('/homeAnswerList',function(req,res) {
    
            try {
    
                ask.find({
                    status : 2
                },function(err,docs) {
    
                    if(err) {
                        res.send({
                            status : 201,
                            message : '获取待问题列表失败'
                        });
                    }else{
                        res.send({
                            status : 200,
                            message : '获取列表成功',
                            data : docs
                        })
                    }
                    
                });
    
            } catch (error) {
    
                res.send({
                    status : 500,
                    message : '系统出错'
                });
                
            }
    });


module.exports = router;