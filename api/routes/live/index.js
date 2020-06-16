var express = require('express');
var router = express.Router();

const auth = require('@middlewares/auth');
const { loginSchema } = require('./validator');
const { getcams, playcam, stopcam, testh264 } = require('./service');

router.get('/getcams', [auth], async function (req, res, next) {
  try {
    const user = req.user;
    const query = req.query;
    return res.send(await getcams({ user, query }));
  } catch (error) {
    return next(error);
  }
});

router.get('/play', [auth], async function (req, res, next) {
  try {
    const data = {
      user: req.user,
      socketUser: req.app.socketUser,
      id: req.query.id,
    };
    return res.send(await playcam(data));
  } catch (error) {
    return next(error);
  }
});

router.get('/stop', [auth], async function (req, res, next) {
  try {
    const data = {
      id: req.query.id,
    };
    await stopcam(data);
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.get('/testh264', [auth], async function (req, res, next) {
  try {
    const data = {
      user: req.user,
      socketUser: req.app.socketUser,
      id: req.query.id,
    };

    return res.end(await testh264(data));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
