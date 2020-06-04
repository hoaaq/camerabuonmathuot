const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');

BaseModel.knex(knex);

class Location extends BaseModel {
  static get tableName() {
    return 'location';
  }

  static get relationMappings() {
    return relation(Location);
  }
}

module.exports = {
  Location,
};
