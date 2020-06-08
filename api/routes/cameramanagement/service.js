const { depthRecursiveRelation } = require('@utils/helper');
const { Location } = require('@models/location');
const { Camera } = require('@models/camera');
const { Dvr } = require('@models/dvr');
const { ClientDigestAuth } = require('@mreal/digest-auth');
if (typeof require !== 'undefined') XLSX = require('xlsx');

const axios = require('axios').default;

module.exports = {
  gettreelocation,
  findbylocation,
  findbycamid,
  addcam,
  editcam,
  delcam,
  uploadInsert,
  getcamfromdvr,
  addbydvr,
};

async function gettreelocation({ user }) {
  try {
    const userlocation = await user.$relatedQuery('location');
    const recursiveLocation = await userlocation.$fetchGraph(
      `[camera, childs.${depthRecursiveRelation('[childs?, camera]', 3)}]`
    );
    return recursiveLocation;
  } catch (error) {
    throw error;
  }
}

async function findbylocation({ id }) {
  try {
    const location = await Location.relatedQuery('camera').for(id);
    return location;
  } catch (error) {
    throw error;
  }
}

async function findbycamid({ id }) {
  try {
    const cam = await Camera.query().findById(id);
    return cam;
  } catch (error) {
    throw error;
  }
}

async function addcam({ body }) {
  const trx = await Camera.startTransaction();
  try {
    const locations = await Location.query()
      .findById(body.location_id)
      .withGraphFetched(`[parent.${depthRecursiveRelation('[parent?]', 3)}]`);
    function recursive(item) {
      if (!item.parent) {
        return item.ten;
      }
      return item.ten + ' ' + recursive(item.parent);
    }
    body.fulltext = recursive(locations);
    await Camera.query(trx).insert(body);
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function editcam({ body }) {
  const trx = await Camera.startTransaction();
  try {
    await Camera.query(trx).findById(body.id).patch(body);
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function delcam({ id }) {
  const trx = await Camera.startTransaction();
  try {
    await Camera.query(trx).findById(id).delete();
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function uploadInsert({ file, location_id }) {
  const trx = await Camera.startTransaction();
  try {
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetname = workbook.Props.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetname]);
    const insertData = sheetData.map((item) => {
      return {
        ...item,
        location_id,
      };
    });
    await Camera.query(trx).insert(insertData);
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function getcamfromdvr({ link, username, password }) {
  try {
    await axios.get(link);
  } catch (error) {
    try {
      const headers = error.response.headers;
      const incomingDigest = ClientDigestAuth.analyze(
        headers['www-authenticate']
      );
      const digest = ClientDigestAuth.generateProtectionAuth(
        incomingDigest,
        username,
        password,
        {
          method: 'GET',
          uri: link,
          counter: 1,
        }
      );
      const res = await axios.get(link, {
        headers: {
          Authorization: `Digest username="${digest.username}", realm="${digest.realm}", nonce="${digest.nonce}", response="${digest.response}", uri="${digest.uri}", qop="${digest.qop}", cnonce="${digest.cnonce}", nc="${digest.nc}", algorithm="${digest.algorithm}", opaque="${digest.opaque}"`,
        },
      });
      const listcam = res.data.split(/\r?\n/);
      const pattern = /(table\.ChannelTitle\[)(\d+)(\]\.Name=)(.+)/;
      let data = [];
      listcam.forEach((element) => {
        const ar = pattern.exec(element);
        if (ar) {
          const channel = Number.parseInt(ar[2]);
          const name = ar[4];
          data.push({
            channel,
            name,
          });
        }
      });
      return data;
    } catch (error2) {
      throw error2;
    }
  }
}

async function addbydvr({
  dvrhost,
  dvrport,
  username,
  password,
  location_id,
  listcam,
}) {
  const trx = await Dvr.startTransaction();
  try {
    const newdvr = await Dvr.query(trx).insertAndFetch({
      host: dvrhost,
      port: dvrport,
      us: username,
      pw: password,
    });
    const locations = await Location.query()
      .findById(location_id)
      .withGraphFetched(`[parent.${depthRecursiveRelation('[parent?]', 3)}]`);
    function recursive(item) {
      if (!item.parent) {
        return item.ten;
      }
      return item.ten + ' ' + recursive(item.parent);
    }
    const fulltext = recursive(locations);
    listcam.forEach((item) => {
      item.location_id = location_id;
      item.dvrconfig_id = newdvr.id;
      item.fulltext = fulltext;
    });
    await Camera.query(trx).insert(listcam);
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}
