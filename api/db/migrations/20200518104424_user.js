exports.up = function (knex) {
  return knex.schema.createTable('user', (t) => {
    t.increments('id');
    t.string('username').notNullable().unique();
    t.string('password').notNullable();
    t.string('name').notNullable();
    t.boolean('disabled').defaultTo(false);

    t.timestamp('created_date').defaultTo(knex.fn.now());
    t.timestamp('updated_date');

    t.integer('role_id').unsigned();
    t.foreign('role_id')
      .references('id')
      .inTable('role')
      .onDelete('restrict')
      .onUpdate('restrict');
    // t.integer('hierarchy_id').unsigned();
    // t.foreign('hierarchy_id')
    //   .references('id')
    //   .inTable('hierarchy')
    //   .onDelete('restrict')
    //   .onUpdate('restrict');
    t.integer('location_id').unsigned();
    t.foreign('location_id')
      .references('id')
      .inTable('location')
      .onDelete('restrict')
      .onUpdate('restrict');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('user');
};
