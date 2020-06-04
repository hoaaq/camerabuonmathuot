module.exports = async (knex) => {
  await knex('role').del();
  await knex('role').insert([
    {
      code: 'tinh',
      description: 'tỉnh',
    },
    {
      code: 'huyen',
      description: 'huyện',
    },
    {
      code: 'xa',
      description: 'xã',
    },
  ]);

  return;
};
