module.exports = async (knex) => {
  await knex('menu').del();
  await knex('menu').insert([
    {
      name: 'Livestream',
      slug: '/livestream',
      icon: 'mdi-camera',
      order: 1,
      parent_id: null,
    },
    {
      name: 'Playback',
      slug: '/playback',
      icon: 'mdi-film',
      order: 2,
      parent_id: null,
    },
    {
      name: 'Quản lý camera',
      slug: '/camera-management',
      icon: 'mdi-camera-burst',
      order: 3,
      parent_id: null,
    },
    {
      name: 'Thiết lập',
      slug: '/config',
      icon: 'mdi-cog',
      order: 4,
      parent_id: null,
    },
  ]);

  return;
};
