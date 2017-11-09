import express from 'express';
import db from './mongodb/db.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import multipart from 'connect-multiparty';
import router from './routes/index.js';

const app = express();

app.all('*',(req,res,next) =>  {
   res.header("Access-Control-Allow-Origin",'*');
   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
   res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
   res.header("Access-Control-Allow-Credentials", true); //可以带cookies
   if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
    next();
    }
});

const MongoStore = connectMongo(session);
//中间件
app.use(cookieParser());
app.use(bodyParser({uploadDir:'./public/upload'}));  //body消息体解析
app.use(multipart());
app.use(express.static('./public'))  //静态资源

router(app);

app.listen(8000);