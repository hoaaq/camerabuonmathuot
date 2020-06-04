const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');

BaseModel.knex(knex);

class Role extends BaseModel {
  static get tableName() {
    return 'role';
  }

  static get relationMappings() {
    return relation(Role);
  }
}

module.exports = {
  Role,
};
