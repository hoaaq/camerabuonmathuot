exports.up = async function (knex) {
  await knex.schema.createTable('menu', (t) => {
    t.increments('id');
    t.string('name').notNullable();
    t.string('slug').notNullable();
    t.string('icon');
    t.integer('order');
    t.boolean('disabled').defaultTo(false);
  });

  await knex.schema.table('menu', function (t) {
    t.integer('parent_id').unsigned();
    t.foreign('parent_id')
      .references('id')
      .inTable('menu')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
  });

  return;
};

exports.down = function (knex) {
  return knex.schema.dropTable('menu');
};
