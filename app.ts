import { jwtMiddleware } from "./middlewares/jwt.middleware";

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const indexRouter = require('./routes/index.route');
const userRouter = require('./routes/user.route');
const progressRouter = require('./routes/progress.route');
const taskRouter = require('./routes/task.route');
const teamRouter = require('./routes/team.route');
const authRouter = require('./routes/auth.route');
const statisticRouter = require('./routes/statistics.route');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/task', taskRouter);
app.use('/team', teamRouter);
app.use('/progress', progressRouter);
app.use('/statistic', statisticRouter);
app.use('/auth', authRouter);

module.exports = app;
