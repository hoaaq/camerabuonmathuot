var express = require('express');
var router = express.Router();

const auth = require('@middlewares/auth');
const { checkId, checkSearch } = require('./validator');
const { login, gettreelocation, getcams, getcam } = require('./service');
const { loginSchema } = require('../user/validator');

router.post('/login', [loginSchema], async function (req, res, next) {
  try {
    const body = req.body;
    return res.send(await login({ body }));
  } catch (error) {
    return next(error);
  }
});

router.get('/listcamsbylocation', [auth, checkSearch], async function (
  req,
  res,
  next
) {
  try {
    const user = req.user;
    const searchstring = req.query.searchstring;
    return res.send(await gettreelocation({ user, searchstring }));
  } catch (error) {
    return next(error);
  }
});

router.get('/listcams', [auth, checkSearch], async function (req, res, next) {
  try {
    const user = req.user;
    const searchstring = req.query.searchstring;
    return res.send(await getcams({ user, searchstring }));
  } catch (error) {
    return next(error);
  }
});

router.get('/detailcam', [auth, checkId], async function (req, res, next) {
  try {
    const id = req.query.id;
    return res.send(await getcam({ id }));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
