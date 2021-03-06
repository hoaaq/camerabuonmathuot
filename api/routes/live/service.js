const { Camera } = require('@models/camera');
const { depthRecursiveRelation } = require('@utils/helper');
const Websocket = require('ws');
const ffmpeg = require('fluent-ffmpeg');

module.exports = {
  getcams,
  playcam,
  stopcam,
  testh264,
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

async function playcamold({ user, socketUser, id }) {
  try {
    const camera = await Camera.query().findById(id);
    const dvr = await camera.$relatedQuery('dvr');

    // Producer
    const topicProduce = `ws://${process.env.PULSAR_HOST}:${process.env.PULSAR_PORT_WS}/ws/v2/producer/${process.env.PULSAR_TOPIC_PREFIX}camera-server-topic`;
    const wsProduce = new Websocket(topicProduce);
    const data = {
      camera_url: `rtsp://${encodeURIComponent(dvr.us)}:${encodeURIComponent(
        dvr.pw
      )}@${dvr.host}:${dvr.port}/cam/realmonitor?channel=${
        camera.channel + 1
      }&subtype=1`,
      camera_id: camera.id,
      fps: 15,
      command: 'add',
      size: [-1, 480],
    };
    const message = {
      payload: Buffer.from(JSON.stringify(data)).toString('base64'),
    };
    const databeat = {
      camera_id: camera.id,
      command: 'beat',
    };
    const messagebeat = {
      payload: Buffer.from(JSON.stringify(databeat)).toString('base64'),
    };
    wsProduce.on('open', function () {
      wsProduce.send(JSON.stringify(message));
      socketUser[user.id].on('clientbeat', function () {
        wsProduce.send(JSON.stringify(messagebeat));
      });
    });
    let hasresult = false;
    wsProduce.on('message', function (message) {
      if (!hasresult) {
        const jsonres = JSON.parse(message);
        if (jsonres.result === 'ok') {
          socketUser[user.id].emit('letbeat', { camera_id: camera.id });
        } else {
          socketUser[user.id].emit('cameraerror', { camera_id: camera.id });
        }
        hasresult = true;
      }
    });
    wsProduce.onerror = function (message) {
      console.log(message);
      socketUser[user.id].emit('cameraerror', { camera_id: camera.id });
    };

    // Consumer
    const topicConsume = `ws://${process.env.PULSAR_HOST}:${
      process.env.PULSAR_PORT_WS
    }/ws/v2/consumer/${process.env.PULSAR_TOPIC_PREFIX}${camera.id}/sub_${
      dvr.id
    }_${camera.id}_${Date.now()}`;
    const wsConsume = new Websocket(topicConsume);
    // const stream = ss.createStream();
    // ss(socketUser[user.id]).emit('livestream', stream, { id });
    wsConsume.on('message', function (message) {
      const receiveMsg = JSON.parse(message);
      // stream.write(receiveMsg.payload);
      socketUser[user.id].volatile.emit('livestream', {
        id,
        buffer: receiveMsg.payload,
      });
      const ackMsg = { messageId: receiveMsg.messageId };
      wsConsume.send(JSON.stringify(ackMsg));
    });
    return;
  } catch (error) {
    throw error;
  }
}

async function playcam({ user, socketUser, id }) {
  try {
    const camera = await Camera.query().findById(id);
    const dvr = await camera.$relatedQuery('dvr');

    // Producer
    const topicProduce = `ws://${process.env.PULSAR_HOST}:${process.env.PULSAR_PORT_WS}/ws/v2/producer/${process.env.PULSAR_TOPIC_PREFIX}camera-server-topic`;
    const wsProduce = new Websocket(topicProduce);
    const data = {
      camera_url: `rtsp://${encodeURIComponent(dvr.us)}:${encodeURIComponent(
        dvr.pw
      )}@${dvr.host}:${dvr.port}/cam/realmonitor?channel=${
        camera.channel + 1
      }&subtype=1`,
      camera_id: camera.id,
      fps: 15,
      command: 'add',
      size: [-1, 480],
    };
    const message = {
      payload: Buffer.from(JSON.stringify(data)).toString('base64'),
    };
    const databeat = {
      camera_id: camera.id,
      command: 'beat',
    };
    const messagebeat = {
      payload: Buffer.from(JSON.stringify(databeat)).toString('base64'),
    };
    wsProduce.on('open', function () {
      wsProduce.send(JSON.stringify(message));
      socketUser[user.id].on('clientbeat', function () {
        wsProduce.send(JSON.stringify(messagebeat));
      });
    });
    let hasresult = false;
    wsProduce.on('message', function (message) {
      if (!hasresult) {
        const jsonres = JSON.parse(message);
        if (jsonres.result === 'ok') {
          socketUser[user.id].emit('letbeat', { camera_id: camera.id });
        } else {
          socketUser[user.id].emit('cameraerror', { camera_id: camera.id });
        }
        hasresult = true;
      }
    });
    wsProduce.onerror = function (message) {
      console.log(message);
      socketUser[user.id].emit('cameraerror', { camera_id: camera.id });
    };

    // Consumer
    const topicConsume = `ws://${process.env.PULSAR_HOST}:${
      process.env.PULSAR_PORT_WS
    }/ws/v2/consumer/${process.env.PULSAR_TOPIC_PREFIX}${camera.id}/sub_${
      dvr.id
    }_${camera.id}_${Date.now()}`;
    return topicConsume;
  } catch (error) {
    throw error;
  }
}

async function stopcam({ id }) {
  try {
    // Producer
    const topicProduce = `ws://${process.env.PULSAR_HOST}:${process.env.PULSAR_PORT_WS}/ws/v2/producer/${process.env.PULSAR_TOPIC_PREFIX}camera-server-topic`;
    const wsProduce = new Websocket(topicProduce);
    const data = {
      camera_id: id,
      command: 'stop',
    };
    const message = {
      payload: Buffer.from(JSON.stringify(data)).toString('base64'),
    };
    wsProduce.on('open', function () {
      wsProduce.send(JSON.stringify(message));
    });
    wsProduce.onerror = function (message) {
      console.log(message);
    };
    return;
  } catch (error) {
    throw error;
  }
}

async function testh264({ user, socketUser, id }) {
  try {
    const camera = await Camera.query().findById(id);
    const dvr = await camera.$relatedQuery('dvr');
    const data = {
      camera_url: `rtsp://${encodeURIComponent(dvr.us)}:${encodeURIComponent(
        dvr.pw
      )}@${dvr.host}:${dvr.port}/cam/realmonitor?channel=${
        camera.channel + 1
      }&subtype=1`,
      camera_id: camera.id,
      fps: 15,
      command: 'add',
      size: [-1, 480],
    };
    var cmd = ffmpeg(data.camera_url)
      .addInputOption('-rtsp_transport tcp')
      // .addOutputOption('-movflags +frag_keyframe+empty_moov+default_base_moof')
      // .addOutputOption('-b 32k')
      .format('h264')
      .on('error', function (err) {
        console.log('An error occurred: ' + err.message);
      })
      .on('end', function () {
        console.log('Processing finished !');
      });
    var ffstream = cmd.pipe();
    ffstream.on('data', function (chunk) {
      // console.log(chunk);
      socketUser[user.id].volatile.emit('livestream', {
        id,
        buffer: chunk,
      });
    });
    return;
  } catch (error) {
    throw error;
  }
}
