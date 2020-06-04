const { BaseModel } = require('@models/basemodel');
const { knex } = require('@knex');
const relation = require('./relation');

BaseModel.knex(knex);

class Camera extends BaseModel {
  static get tableName() {
    return 'camera';
  }

  static get relationMappings() {
    return relation(Camera);
  }
}

module.exports = {
  Camera,
};
