const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');
const { generateAuthToken, findByCredentials } = require('./method');

BaseModel.knex(knex);

class User extends BaseModel {
  static get tableName() {
    return 'user';
  }

  static get relationMappings() {
    return relation(User);
  }
}

User.findByCredentials = findByCredentials;
User.prototype.generateAuthToken = generateAuthToken;

module.exports = {
  User,
};
