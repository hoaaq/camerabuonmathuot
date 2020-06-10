const { Camera } = require('@models/camera');
const { depthRecursiveRelation } = require('@utils/helper');
const Websocket = require('ws');

module.exports = {
  getcams,
  playcam,
};

async function getcams({ user, query }) {
  try {
    const userlocation = await (
      await user.$relatedQuery('location')
    ).$fetchGraph(`[childs.${depthRecursiveRelation('[childs?]', 3)}]`);
    let locId = [];
    function recursive(item) {
      locId = [...locId, item.id];
      if (item.childs.length === 0) {
        return;
      }
      item.childs.forEach((element) => {
        return recursive(element);
      });
    }
    recursive(userlocation);

    const camPromise = Camera.query().whereIn('location_id', locId);

    if (query.search) {
      const tmp = query.search.split();
      let formatedSearch = '';
      tmp.forEach((element) => {
        formatedSearch += 'or ' + element;
      });
      camPromise.whereRaw('fts @@ websearch_to_tsquery(vn_unaccent(?))', [
        formatedSearch,
      ]);
    }

    return await camPromise;
  } catch (error) {
    throw error;
  }
}

async function playcam({ user, socketUser, pulsarUser, id }) {
  try {
    const camera = await Camera.query().findById(id);
    const dvr = await camera.$relatedQuery('dvr');
    const producer = await pulsarUser[user.id].createProducer({
      topic: process.env.PULSAR_TOPIC_PREFIX + 'camera-server-topic',
    });
    data = {
      camera_url: `rtsp://${encodeURIComponent(dvr.us)}:${encodeURIComponent(
        dvr.pw
      )}@${dvr.host}:${dvr.port}/cam/realmonitor?channel=${
        camera.channel + 1
      }&subtype=1`,
      // camera_url: `rtsp://admin:123456ab@192.168.1.118:554/Streaming/Channels/102/`,
      camera_id: camera.id,
      fps: 15,
      command: 'add',
    };
    await producer.send({
      data: Buffer.from(JSON.stringify(data)),
    });
    await producer.close();
    const topic =
      process.env.PULSAR_WS +
      camera.id +
      '/' +
      'sub_' +
      dvr.id +
      '_' +
      camera.id +
      '_' +
      Date.now();
    const ws = new Websocket(topic);

    var ss = require('socket.io-stream');
    var stream = ss.createStream();
    ss(socketUser[user.id]).emit('livestream', stream, { id });
    ws.on('message', function (message) {
      var receiveMsg = JSON.parse(message);
      stream.write(receiveMsg.payload);
      var ackMsg = { messageId: receiveMsg.messageId };
      ws.send(JSON.stringify(ackMsg));
    });
    // const consumer = await pulsarUser[user.id].subscribe({
    //   topic: process.env.PULSAR_TOPIC_PREFIX + camera.id,
    //   subscription: 'sub_' + dvr.id + '_' + camera.id + '_' + Date.now(),
    // });
    // (async () => {
    //   var ss = require('socket.io-stream');
    //   var stream = ss.createStream();
    //   ss(socketUser[user.id]).emit('livestream', stream, { id });
    //   while (true) {
    //     try {
    //       const msg = await consumer.receive();
    //       stream.write(msg.getData());
    //       consumer.acknowledge(msg);
    //     } catch (error) {
    //       console.log(error);
    //       break;
    //     }
    //   }
    //   await consumer.close();
    // })();
    return;
  } catch (error) {
    throw error;
  }
}
