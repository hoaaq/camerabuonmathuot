exports.up = function (knex) {
  return knex.schema.createTable('rel_menu_role', (t) => {
    t.increments('id');
    t.integer('menu_id').unsigned();
    t.foreign('menu_id')
      .references('id')
      .inTable('menu')
      .onDelete('restrict')
      .onUpdate('restrict');
    t.integer('role_id').unsigned();
    t.foreign('role_id')
      .references('id')
      .inTable('role')
      .onDelete('restrict')
      .onUpdate('restrict');
    t.unique(['role_id', 'menu_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('rel_menu_role');
};
