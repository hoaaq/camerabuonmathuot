var express = require('express');
var router = express.Router();

const auth = require('@middlewares/auth');
const { getMenu } = require('./service');

router.get('/', [auth], async function (req, res, next) {
  try {
    const user = req.user;
    return res.send(await getMenu(user));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
