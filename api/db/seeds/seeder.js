const location = require('./detail/00_location');
const role = require('./detail/01_role');
const action = require('./detail/02_action');
const relroleaction = require('./detail/03_rel_role_action');
const user = require('./detail/05_user');
const menu = require('./detail/06_menu');
const relrolemenu = require('./detail/07_rel_role_menu');
// const camera = require('./detail/08_camera');

exports.seed = async function (knex) {
  await location(knex);
  await role(knex);
  await action(knex);
  await relroleaction(knex);
  await user(knex);
  await menu(knex);
  await relrolemenu(knex);
  // await camera(knex);

  return;
};
