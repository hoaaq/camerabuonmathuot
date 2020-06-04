var bcrypt = require('bcryptjs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function checkPassword(password, dbpass) {
  return await bcrypt.compare(password, dbpass);
}

function generateIndex(list, query) {
  for (let i = 0; i < list.length; i++) {
    const ele = list[i];
    ele.index = (query.page || 0) * (query.pageSize || 10) + (i + 1);
  }
  return list;
}

function depthRecursiveRelation(expr, depth) {
  return expr.replace(
    '?',
    depth > 0 ? '.' + depthRecursiveRelation(expr, depth - 1) : ''
  );
}

module.exports = {
  hashPassword,
  checkPassword,
  generateIndex,
  depthRecursiveRelation,
};
