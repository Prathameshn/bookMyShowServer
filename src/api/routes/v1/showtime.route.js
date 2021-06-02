const express = require('express');
const controller = require('@controllers/showtime.controller');
const showTimeService = require("@services/showtime.service")
const seatService = require("@services/seat.service")

const router = express.Router();

router.param('showtimeId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(showTimeService.checkAvailablity,controller.create,seatService.create)

router
   .route('/:showtimeId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

router
   .route('/:showtimeId/addSeat')
   .get(controller.increseSeat,seatService.addSeat)

router
   .route('/:showtimeId/getSeats')
   .get(seatService.getSeatbyShowtime)


module.exports = router;
