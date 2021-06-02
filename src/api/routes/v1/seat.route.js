const express = require('express');
const controller = require('@controllers/seat.controller');
const { authorize } = require('@middlewares/auth');

const router = express.Router();

router.param('seatId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(controller.create)

router
   .route('/:seatId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

router
   .route('/:seatId/book')
   .get(controller.bookTicket)

module.exports = router;
