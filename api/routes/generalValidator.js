const { checkSchema } = require('express-validator');
const validate = require('@middlewares/validate');

const listSchema = validate(
  checkSchema({
    orderBy: {
      in: ['query'],
      errorMessage: 'Invalid orderBy',
      isString: true,
      optional: {
        options: {
          nullable: true,
        },
      },
    },
    orderDesc: {
      in: ['query'],
      errorMessage: 'Invalid orderDesc',
      isBoolean: true,
      optional: {
        options: {
          nullable: true,
        },
      },
    },
    page: {
      in: ['query'],
      errorMessage: 'Invalid page',
      isInt: true,
      optional: {
        options: {
          nullable: true,
        },
      },
    },
    pageSize: {
      in: ['query'],
      errorMessage: 'Invalid pageSize',
      isInt: true,
      optional: {
        options: {
          nullable: true,
        },
      },
    },
    dateRange: {
      in: ['query'],
      errorMessage: 'Invalid dateRange',
      isArray: true,
      optional: {
        options: {
          nullable: true,
        },
      },
    },
  })
);
const checkId = validate(
  checkSchema({
    id: {
      in: ['query', 'body'],
      errorMessage: 'Invalid id',
      isInt: true,
      notEmpty: true,
    },
  })
);

module.exports = {
  listSchema,
  checkId,
};
