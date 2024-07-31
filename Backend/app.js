var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
// hash
var usersRouter = require('./routes/users');
var queryRouter = require('./routes/query');
var userRouter = require('./routes/users')
const PORT = 8080;
const app = express();
const session = require('express-session');
// connect to mysql
const mysql = require('mysql2/promise');
const config = require('./config.json')
const dbConfig = {
  host: config.rds_host,
  user: config.rds_user,
  password: config.rds_password,
  port: config.rds_port,
  database: config.rds_db
};


// module.exports = db.promise();

//——————————————————————————————————use————————————————————————————————

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['POST', 'PUT', 'GET', 'OPTIONS', 'HEAD'],
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: 'cis5500_insecure', saveUninitialized: true, cookie: { httpOnly: false }, resave: true
}));



//  express-session
app.use(session({
  secret: 'jsjsjsjsjsjs',  // 用来注册 session ID cookie 的秘钥，应保持安全
  resave: false,              // 强制将 session 保存回 session 存储
  saveUninitialized: false,   // 强制保存未初始化的 session 到存储
  cookie: { secure: false }   // 在 HTTP 中有效，HTTPS 中则设置为 true
}));
//————————————————————————————get/set--------------------------------------------

app.get('/query/songs1', queryRouter.songs1 )
app.get('/query/songs2', queryRouter.songs2 )
app.get('/query/top10', queryRouter.top10)
app.get('/query/indChart', queryRouter.indCharts)
app.get('/query/songChars', queryRouter.songChars)
app.get('/getScore', queryRouter.getScore)

app.post('/userScore', userRouter.userScore)
app.post('/register', userRouter.register)
app.post('/login', userRouter.login)
app.post('/reset-password', userRouter.resetPassword)
app.post('/delete-user', userRouter.deleteUser)
app.get('/logout', userRouter.logOut)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
