import express from 'express';
import ask from '../mongodb/ask';

const router = express.Router();

var findUserName = function (userId,callback) {

    ask.findById(userId,function(err,data) {

        if(err) {
            throw new '查询用户名失败';
        }else{
            console.log(9099);
            console.log(data);
            if(callback) callback(data);
        }

    })
}


let saveAsk = async (replyId,askId,content,res) => {

    let replyUsername = await findUserName(replyId);
    let askUsername = await findUserName(askId);
    let data = {
        reply_id : replyId,
        ask_id : askId,
        reply_username : replyUsername,
        ask_username : askUsername,
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

    console.log(req.body);

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

module.exports = router;