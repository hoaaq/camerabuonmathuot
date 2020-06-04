exports.up = async function (knex) {
  await knex.schema.createTable('dvrconfig', (t) => {
    t.increments('id');
    t.string('host');
    t.string('port');
    t.string('us');
    t.string('pw');
  });
  return;
};

exports.down = async function (knex) {
  await knex.schema.dropTable('dvrconfig');
  return;
};
