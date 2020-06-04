const { validationResult, matchedData } = require('express-validator');

const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      req.query = matchedData(req, { locations: ['query'] });
      req.body = matchedData(req, { locations: ['body'] });
      return next();
    }

    const err = new Error(errors.array()[0].msg);
    err.status = 400;
    err.name = 'Validation Error';
    throw err;
  };
};

module.exports = validate;
