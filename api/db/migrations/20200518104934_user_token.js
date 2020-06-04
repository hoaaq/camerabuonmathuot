exports.up = function (knex) {
  return knex.schema.createTable('user_token', (t) => {
    t.increments('id');
    t.string('token').notNullable();
    t.string('token_type');
    t.timestamp('created_date').defaultTo(knex.fn.now());

    t.integer('user_id').unsigned();
    t.foreign('user_id')
      .references('id')
      .inTable('user')
      .onDelete('restrict')
      .onUpdate('restrict');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user_token');
};
