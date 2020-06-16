require('module-alias/register');
require('dotenv').config();
var express = require('express');
var path = require('path');

require('express-async-errors');
const { notfoundapi, errorHandler } = require('@utils/errorHandler');

var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

var ioApp = require('http').createServer(handler);
app.io = require('socket.io')(ioApp, {
  transports: ['websocket', 'polling'],
});
ioApp.listen(4001);
function handler(req, res) {
  res.writeHead(200).end({});
}

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use('/', indexRouter);

// region socketServer
app._socket = null;
app.socketUser = {};
app.io.sockets.on('connection', function (socket) {
  app._socket = socket;
  console.log(socket.id + ' connected');
});

app.use([notfoundapi, errorHandler]);

module.exports = app;
