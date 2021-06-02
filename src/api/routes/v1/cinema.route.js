const express = require('express');
const controller = require('@controllers/cinema.controller');

const router = express.Router();

router.param('cinemaId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(controller.create)

router
   .route('/:cinemaId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

module.exports = router;
