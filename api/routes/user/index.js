var express = require('express');
var router = express.Router();

const auth = require('@middlewares/auth');
const { loginSchema } = require('./validator');
const { login, logout } = require('./service');

router.post('/login', [loginSchema], async function (req, res, next) {
  try {
    const data = {
      body: req.body,
    };
    return res.send(await login(data));
  } catch (error) {
    return next(error);
  }
});

router.get('/me', [auth], async function (req, res, next) {
  try {
    let _socket = req.app.get('_socket');
    let socketUser = req.app.get('socketUser');
    //userid must be unique
    req.app._socket.userId = user.id;
    //now every user has a socket associated with their id
    req.app.socketUser[req.app._socket.userId] = req.app._socket;
    return res.send({
      user: { ...req.user },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/logout', [auth], async function (req, res, next) {
  try {
    const data = {
      user: req.user,
      token: req.token.token,
      socketUser: req.app.socketUser,
    };
    await logout(data);
    return res.end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
