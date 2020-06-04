const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');

const relation = require('./relation');

BaseModel.knex(knex);

class User_token extends BaseModel {
  static get tableName() {
    return 'user_token';
  }

  static get relationMappings() {
    return relation(User_token);
  }

  $beforeInsert() {
    this.created_date = new Date().toISOString();
  }
}

module.exports = {
  User_token,
};
