const express = require('express');
const controller = require('@controllers/auth.controller');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

router.route('/login')
  .post(controller.userLogin)

module.exports = router;
