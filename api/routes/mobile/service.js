const { depthRecursiveRelation } = require('@utils/helper');
const { Location } = require('@models/location');
const { Camera } = require('@models/camera');
const { Dvr } = require('@models/dvr');
const { User } = require('@models/user');
const { ClientDigestAuth } = require('@mreal/digest-auth');
const { search } = require('../../app');

const axios = require('axios').default;

module.exports = {
  login,
  gettreelocation,
  getcams,
  getcam,
};

async function login({ body }) {
  const trx = await User.startTransaction();
  try {
    user = await User.findByCredentials(
      body.username,
      body.password.toString()
    );
    if (!user) {
      const err = new Error('Login failed! Check authentication credentials');
      err.status = 401;
      throw err;
    }
    if (user.disabled) {
      const err = new Error('Tài khoản người dùng đã bị khóa');
      err.status = 401;
      throw err;
    }
    const token = await user.generateAuthToken(trx, 'mobile');
    trx.commit();

    return { user, token };
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function gettreelocation({ user, searchstring }) {
  try {
    const userlocation = await user.$relatedQuery('location');
    const recursiveLocation = await userlocation
      .$fetchGraph(
        `[camera(search), childs.${depthRecursiveRelation(
          '[childs?, camera(search)]',
          3
        )}]`
      )
      .modifiers({
        search(b) {
          if (searchstring) {
            const tmp = searchstring.split();
            let formatedSearch = '';
            tmp.forEach((element) => {
              formatedSearch += 'or ' + element;
            });
            b.whereRaw('fts @@ websearch_to_tsquery(vn_unaccent(?))', [
              formatedSearch,
            ]);
          }
        },
      });
    return recursiveLocation;
  } catch (error) {
    throw error;
  }
}

async function getcams({ user, searchstring }) {
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
    if (searchstring) {
      const tmp = searchstring.split();
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

async function getcam({ id }) {
  try {
    const camera = await Camera.query().findById(id);
    const dvr = await camera.$relatedQuery('dvr');
    const rtsplink = `rtsp://${encodeURIComponent(dvr.us)}:${encodeURIComponent(
      dvr.pw
    )}@${dvr.host}:${dvr.port}/cam/realmonitor?channel=${
      camera.channel + 1
    }&subtype=1`;
    return {
      id,
      name: camera.name,
      location: camera.fulltext,
      rtsplink,
    };
  } catch (error) {
    throw error;
  }
}
