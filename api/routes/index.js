var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.json({ title: 'Sample Fullstack api' });
});

const mobile = require('./mobile');
router.use('/mobile', mobile);

const user = require('./user');
router.use('/user', user);

const menu = require('./menu');
router.use('/menu', menu);

const live = require('./live');
router.use('/live', live);

const playback = require('./playback');
router.use('/playback', playback);

const map = require('./map');
router.use('/map', map);

const cameramanagement = require('./cameramanagement');
router.use('/cameramanagement', cameramanagement);

module.exports = router;
