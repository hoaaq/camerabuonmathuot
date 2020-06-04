require('module-alias/register');
require('dotenv').config();
var express = require('express');
var path = require('path');
const { Kafka } = require('kafkajs');

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

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['192.168.1.119:9092'],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'test-group' });

// var rtsp = require('rtsp-ffmpeg');
// var uri = 'rtsp://wowzaec2demo.streamlock.net/vod/mp4:BigBuckBunny_115k.mov';
// var stream = new rtsp.FFMpeg({ input: uri });
// var pipeStream = async function (data) {
//   await producer.send({
//     topic: 'test-topic',
//     messages: [{ value: data.toString('base64') }],
//   });
// };

const run = async () => {
  await producer.connect();
  stream.on('data', pipeStream);
  // Producing

  // Consuming
  await consumer.connect();
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
    },
  });
};

// run().catch(console.error);

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
