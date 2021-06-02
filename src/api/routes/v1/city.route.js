const express = require('express');
const controller = require('@controllers/city.controller');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

router.param('cityId', controller.load);

router
   .route('/')
   .get(authorize(),controller.list)
   .post(authorize(),controller.create)

router
   .route('/:cityId')
   .get(authorize(),controller.get)
   .patch(authorize(),controller.update)
   .delete(authorize(),controller.remove);

module.exports = router;
