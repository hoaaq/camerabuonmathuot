const { hashPassword } = require('../../../utils/helper');

module.exports = async (knex) => {
  await knex('user').del();
  await knex('user').insert([
    {
      username: 'thanhpho',
      password: await hashPassword('123456'),
      name: 'Thanh Pho',
      role_id: (await knex.table('role').where('code', 'tinh').first()).id,
      location_id: (
        await knex.table('location').where('original_id', '66').first()
      ).id,
    },
    {
      username: 'quan',
      password: await hashPassword('123456'),
      name: 'Quan',
      role_id: (await knex.table('role').where('code', 'huyen').first()).id,
      location_id: (
        await knex.table('location').where('original_id', '643').first()
      ).id,
    },
    {
      username: 'phuongtanlap',
      password: await hashPassword('123456'),
      name: 'Phuong Tan Lap',
      role_id: (await knex.table('role').where('code', 'xa').first()).id,
      location_id: (
        await knex.table('location').where('original_id', '24118').first()
      ).id,
    },
    {
      username: 'phuongtanan',
      password: await hashPassword('123456'),
      name: 'Phuong Tan An',
      role_id: (await knex.table('role').where('code', 'xa').first()).id,
      location_id: (
        await knex.table('location').where('original_id', '24124').first()
      ).id,
    },
  ]);

  return;
};
