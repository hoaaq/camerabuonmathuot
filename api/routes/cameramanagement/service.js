const { depthRecursiveRelation } = require('@utils/helper');
const { Location } = require('@models/location');
const { Camera } = require('@models/camera');
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

async function addbydvr({ dvrlink }) {
  const trx = await Camera.startTransaction();
  try {
    const result = axios.get(
      'http://api:abc123456@783d07f83644.sn.mynetname.net:8080/cgi-bin/configManager.cgi',
      {
        params: {
          action: 'getConfig',
          name: 'ChannelTitle',
        },
      }
    );
    console.log(await result);
    trx.commit();
    return;
  } catch (error) {
    trx.rollback();
    // throw error;
    throw error;
  }
}
