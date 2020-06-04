var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ title: 'Sample Fullstack api' });
});

const user = require('./user');
router.use('/user', user);

const menu = require('./menu');
router.use('/menu', menu);

const live = require('./live');
router.use('/live', live);

const cameramanagement = require('./cameramanagement');
router.use('/cameramanagement', cameramanagement);

module.exports = router;
