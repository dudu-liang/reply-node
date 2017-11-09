import mongoose from 'mongoose';

const url = 'mongodb://localhost:27017/reply';

let db = mongoose.connect(url);

db.connection.on('open',function() {
    console.log('数据库连接成功');
});

db.connection.on('error',function() {
    console.log('数据库连接失败');
});

db.connection.on('close', function() {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(url, {server:{auto_reconnect:true}});
});