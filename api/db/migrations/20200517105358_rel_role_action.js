exports.up = function (knex) {
  return knex.schema.createTable('rel_role_action', (t) => {
    t.increments('id');
    t.integer('role_id').unsigned();
    t.foreign('role_id')
      .references('id')
      .inTable('role')
      .onDelete('restrict')
      .onUpdate('restrict');
    t.integer('action_id').unsigned();
    t.foreign('action_id')
      .references('id')
      .inTable('action')
      .onDelete('restrict')
      .onUpdate('restrict');
    t.unique(['role_id', 'action_id']);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('rel_role_action');
};
