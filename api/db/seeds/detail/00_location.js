const location = require('../../../dstinhhuyenxa20052020_formated.json');

module.exports = async (knex) => {
  await knex('location').del();

  for (let i = 0; i < location.length; i++) {
    const tinhthanhpho = location[i];
    const idtinhthanhpho = await knex('location').returning('id').insert({
      original_id: tinhthanhpho.idtinhthanhpho,
      ten: tinhthanhpho.tentinhthanhpho,
    });
    for (let n = 0; n < tinhthanhpho.quanhuyen.length; n++) {
      const quanhuyen = tinhthanhpho.quanhuyen[n];
      const idquanhuyen = await knex('location').returning('id').insert({
        original_id: quanhuyen.idquanhuyen,
        ten: quanhuyen.tenquanhuyen,
        parent_id: idtinhthanhpho[0],
      });
      let px = [];
      for (let m = 0; m < quanhuyen.phuongxa.length; m++) {
        const phuongxa = quanhuyen.phuongxa[m];
        if (!phuongxa.idphuongxa) continue;
        px.push({
          original_id: phuongxa.idphuongxa,
          ten: phuongxa.tenphuongxa,
          cap: phuongxa.cap,
          tentienganh: phuongxa.tentienganh,
          parent_id: idquanhuyen[0],
        });
      }
      await knex('location').insert(px);
    }
  }

  return;
};
