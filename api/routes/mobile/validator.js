const { checkSchema } = require('express-validator');
const validate = require('@middlewares/validate');
const { checkId, checkSearch } = require('../generalValidator');

module.exports = {
  checkId,
  checkSearch,
};
