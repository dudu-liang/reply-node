import mongoose from 'mongoose';

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name : String, //用户名
    username : String, //昵称
    description : {type : String,default : ''}, //简介
    password : String,
    avatar : {type : String,default : '/img/head.jpg'}
});

let user = mongoose.model('user',userSchema);

module.exports = user;