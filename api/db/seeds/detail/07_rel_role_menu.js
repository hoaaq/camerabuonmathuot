module.exports = async (knex) => {
  await knex('rel_menu_role').del();
  const roles = await knex.table('role');
  const menus = await knex.table('menu');
  let data = [];
  for (let i = 0; i < roles.length; i++) {
    const ele = roles[i];
    for (let n = 0; n < menus.length; n++) {
      const act = menus[n];
      data.push({
        role_id: ele.id,
        menu_id: act.id,
      });
    }
  }

  await knex('rel_menu_role').insert(data);
  return;
};
