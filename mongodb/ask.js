import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let askSchema = new Schema({
    reply_id : String,
    reply_username : String,
    ask_id : String,
    ask_username : String,
    content : String,
    status : {
        type : Number,
        default : 1
    }, //1:待回答，2:已回答
    rep_content : String
});

let ask = mongoose.model('ask',askSchema);

module.exports = ask;