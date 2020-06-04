const { Camera } = require('@models/camera');
const { depthRecursiveRelation } = require('@utils/helper');
var ffmpeg = require('fluent-ffmpeg');

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

async function playcam({ user, socketUser, id, link }) {
  try {
    var command = ffmpeg(link)
      .addOptions(['-f image2pipe'])
      .on('end', function () {
        console.log('end stream');
      })
      .on('error', function (err) {
        console.log('an error happened: ' + err);
      });

    var ffstream = command.pipe();
    ffstream.on('data', function (buffer) {
      socketUser[user.id].emit('data', { id, buffer });
    });
    return;
  } catch (error) {
    throw error;
  }
}
