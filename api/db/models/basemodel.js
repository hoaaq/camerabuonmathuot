const { Model } = require('objection');
const { DBErrors } = require('objection-db-errors');

class BaseModel extends DBErrors(Model) {
  static get modelPaths() {
    return [__dirname];
  }
}

module.exports = {
  BaseModel,
};
