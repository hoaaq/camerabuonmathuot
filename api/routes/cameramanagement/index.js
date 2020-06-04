var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer();

const auth = require('@middlewares/auth');
const { checkId, addnewSchema, updateSchema } = require('./validator');
const {
  gettreelocation,
  findbylocation,
  findbycamid,
  addcam,
  editcam,
  delcam,
  uploadInsert,
  addbydvr,
} = require('./service');

router.get('/', [auth], async function (req, res, next) {
  try {
    const user = req.user;
    return res.send(await gettreelocation({ user }));
  } catch (error) {
    return next(error);
  }
});

router.post('/', [auth, addnewSchema], async function (req, res, next) {
  try {
    const body = req.body;
    await addcam({ body });
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.post('/upload', upload.single('file'), [auth], async function (
  req,
  res,
  next
) {
  try {
    const file = req.file;
    const location_id = req.body.location_id;
    await uploadInsert({ file, location_id });
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.post('/addbydvr', [auth], async function (req, res, next) {
  try {
    const body = req.body;
    await addbydvr({ ...body });
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.put('/', [auth, updateSchema], async function (req, res, next) {
  try {
    const body = req.body;
    await editcam({ body });
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.delete('/', [auth, checkId], async function (req, res, next) {
  try {
    const id = req.query.id;
    await delcam({ id });
    return res.end();
  } catch (error) {
    return next(error);
  }
});

router.get('/findbylocation', [auth, checkId], async function (req, res, next) {
  try {
    const id = req.query.id;
    return res.send(await findbylocation({ id }));
  } catch (error) {
    return next(error);
  }
});

router.get('/findbycamid', [auth, checkId], async function (req, res, next) {
  try {
    const id = req.query.id;
    return res.send(await findbycamid({ id }));
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
