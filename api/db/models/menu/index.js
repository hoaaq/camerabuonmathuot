const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');

BaseModel.knex(knex);

class Menu extends BaseModel {
  static get tableName() {
    return 'menu';
  }

  static get relationMappings() {
    return relation(Menu);
  }
}

module.exports = {
  Menu,
};
