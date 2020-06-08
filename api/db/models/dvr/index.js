const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');

BaseModel.knex(knex);

class Dvr extends BaseModel {
  static get tableName() {
    return 'dvrconfig';
  }

  static get relationMappings() {
    return relation(Dvr);
  }
}

module.exports = {
  Dvr,
};
