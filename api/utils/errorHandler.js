const {
  UniqueViolationError,
  ForeignKeyViolationError,
} = require('objection-db-errors');

const notfoundapi = (req, res, next) => {
  var err = new Error('Not found api');
  err.status = 404;
  return next(err);
};

const errorHandler = async (err, req, res, next) => {
  console.error(err);

  if (err instanceof UniqueViolationError) {
    err.status = 400;
    err.message = 'Dữ liệu đã tồn tại ở bảng ' + err.table;
  }
  if (err instanceof ForeignKeyViolationError) {
    err.status = 409;
    err.message =
      'Không thể thực hiện lệnh, xung đột khóa ngoại tại bảng ' + err.table;
  }
  if (!err.status || err.status < 100 || err.status > 999) err.status = 500;
  return res.status(err.status).json({
    name: err.name,
    message: err.message,
  });
};

module.exports = {
  notfoundapi,
  errorHandler,
};
