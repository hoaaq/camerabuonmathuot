const { User } = require('@models/user');

module.exports = {
  login,
  logout,
};

async function login({ body }) {
  const trx = await User.startTransaction();
  try {
    user = await User.findByCredentials(
      body.username,
      body.password.toString()
    );
    if (!user) {
      const err = new Error('Login failed! Check authentication credentials');
      err.status = 401;
      throw err;
    }
    if (user.disabled) {
      const err = new Error('Tài khoản người dùng đã bị khóa');
      err.status = 401;
      throw err;
    }
    const token = await user.generateAuthToken(trx, 'web');
    trx.commit();

    return { user, token };
  } catch (error) {
    trx.rollback();
    throw error;
  }
}

async function logout(data) {
  const trx = await User.startTransaction();
  try {
    await data.user
      .$relatedQuery('user_token', trx)
      .delete()
      .where('token', data.token);
    trx.commit();
    delete data.socketUser[data.user.id];
    return;
  } catch (error) {
    trx.rollback();
    throw error;
  }
}
