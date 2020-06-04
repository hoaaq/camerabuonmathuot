exports.up = async function (knex) {
  await knex.schema.createTable('location', (t) => {
    t.increments('id');
    t.string('original_id').notNullable().unique();
    t.string('ten');
    t.string('cap');
    t.string('tentienganh');
  });

  await knex.schema.table('location', function (t) {
    t.integer('parent_id').unsigned();
    t.foreign('parent_id')
      .references('id')
      .inTable('location')
      .onDelete('RESTRICT')
      .onUpdate('RESTRICT');
  });

  return;
};

exports.down = function (knex) {
  return knex.schema.dropTable('location');
};
