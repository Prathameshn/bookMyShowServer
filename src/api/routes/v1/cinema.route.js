const express = require('express');
const controller = require('@controllers/cinema.controller');
const showtimeService = require("@services/showtime.service")
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

router
   .route('/:cinemaId/addMovie')
   .patch(controller.addMovie)

router
   .route('/:cinemaId/getShowtimeForMovie')
   .get(showtimeService.getShowtimeForMovie,controller.getShowtimeForMovie)


module.exports = router;
