exports.up = function (knex) {
  return knex.schema.createTable('action', (t) => {
    t.increments('id');
    t.string('code').notNullable().unique();
    t.string('description');
    t.boolean('disabled').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('action');
};
