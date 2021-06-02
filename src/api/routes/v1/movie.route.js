const express = require('express');
const controller = require('@controllers/movie.controller');
const cinemaService = require('@services/cinema.service')

const router = express.Router();

router.param('movieId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(controller.create)

router
   .route('/:movieId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

router
   .route('/:movieId/addCity')
   .patch(controller.addCity)

router   
   .route('/:movieId/cinemas')
   .get(cinemaService.getCinemaForMovie,controller.getCinemaForMovie)

module.exports = router;
