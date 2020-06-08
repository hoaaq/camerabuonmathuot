const { checkSchema } = require('express-validator');
const validate = require('@middlewares/validate');
const { checkId } = require('../generalValidator');

const addnewSchema = validate(
  checkSchema({
    code: {
      in: ['body'],
      errorMessage: 'Invalid code',
      isString: true,
      notEmpty: true,
    },
    link: {
      in: ['body'],
      errorMessage: 'Invalid link',
      isString: true,
      notEmpty: true,
    },
    location_id: {
      in: ['body'],
      errorMessage: 'Invalid location_id',
      isInt: true,
      notEmpty: true,
    },
  })
);

const updateSchema = validate(
  checkSchema({
    id: {
      in: ['body'],
      errorMessage: 'Invalid id',
      isInt: true,
      notEmpty: true,
    },
    code: {
      in: ['body'],
      errorMessage: 'Invalid code',
      isString: true,
      notEmpty: true,
    },
    link: {
      in: ['body'],
      errorMessage: 'Invalid link',
      isString: true,
      notEmpty: true,
    },
  })
);

const getcamdvrSchema = validate(
  checkSchema({
    link: {
      in: ['body'],
      errorMessage: 'Invalid link',
      isString: true,
      notEmpty: true,
    },
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

const addbydvrSchema = validate(
  checkSchema({
    dvrhost: {
      in: ['body'],
      errorMessage: 'Invalid dvrhost',
      isString: true,
      notEmpty: true,
    },
    dvrport: {
      in: ['body'],
      errorMessage: 'Invalid dvrport',
      isInt: true,
      notEmpty: true,
    },
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
    location_id: {
      in: ['body'],
      errorMessage: 'Invalid location_id',
      isInt: true,
      notEmpty: true,
    },
    listcam: {
      in: ['body'],
      errorMessage: 'Invalid listcam',
      isArray: true,
      notEmpty: true,
    },
  })
);

module.exports = {
  addnewSchema,
  updateSchema,
  checkId,
  getcamdvrSchema,
  addbydvrSchema,
};
