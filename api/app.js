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
app.io = require('socket.io')();

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

// const Pulsar = require('pulsar-client');

// (async () => {
//   // Create a client
//   const client = new Pulsar.Client({
//     serviceUrl: 'pulsar://192.168.1.4:6650',
//     operationTimeoutSeconds: 30,
//   });

//   // Create a reader
//   const reader = await client.createReader({
//     topic: 'persistent://public/default/test-topic',
//     startMessageId: Pulsar.MessageId.latest(),
//   });

//   // read messages
//   while (true) {
//     const msg = await reader.readNext();
//     console.log(msg.getData().toString());
//   }

//   await reader.close();
//   await client.close();
// })();

app.use([notfoundapi, errorHandler]);

module.exports = app;
