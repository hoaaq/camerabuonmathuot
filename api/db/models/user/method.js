const jwt = require('jsonwebtoken');
const { checkPassword } = require('@utils/helper');

async function generateAuthToken(trx, src) {
  try {
    const user = this;
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);
    await user
      .$relatedQuery('user_token', trx)
      .insert({ token: token, token_type: src === 'web' ? 'WEBLOGIN' : null });
    return token;
  } catch (error) {
    throw error;
  }
}

async function findByCredentials(username, password) {
  try {
    const user = await this.query().where('username', username).first();
    if (!user) {
      const err = new Error('User not found');
      err.status = 401;
      throw err;
    }
    const isPasswordMatch = await checkPassword(password, user.password);
    if (!isPasswordMatch) {
      const err = new Error('Invalid login credentials');
      err.status = 401;
      throw err;
    }
    return user;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  generateAuthToken,
  findByCredentials,
};
