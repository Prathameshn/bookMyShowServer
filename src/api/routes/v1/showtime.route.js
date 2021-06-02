const express = require('express');
const controller = require('@controllers/showtime.controller');

const router = express.Router();

router.param('showtimeId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(controller.create)

router
   .route('/:showtimeId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

module.exports = router;
