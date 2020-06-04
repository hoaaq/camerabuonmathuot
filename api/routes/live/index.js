var express = require('express');
var router = express.Router();

const auth = require('@middlewares/auth');
const { loginSchema } = require('./validator');
const { getcams, playcam } = require('./service');

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
      link: req.query.link,
    };
    playcam(data);
    return res.end();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
