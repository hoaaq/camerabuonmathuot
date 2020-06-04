const { checkSchema } = require('express-validator');
const validate = require('@middlewares/validate');

const loginSchema = validate(
  checkSchema({
    username: {
      in: ['body'],
      errorMessage: 'Invalid username',
      isString: true,
      notEmpty: true,
    },
    password: {
      in: ['body'],
      errorMessage: 'Invalid password',
      isString: true,
      notEmpty: true,
    },
  })
);

module.exports = {
  loginSchema,
};
