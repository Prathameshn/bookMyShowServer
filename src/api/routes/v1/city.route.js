const express = require('express');
const controller = require('@controllers/city.controller');
const movieServices = require("@services/movie.service")

const router = express.Router();

router.param('cityId', controller.load);

router
   .route('/')
   .get(controller.list)
   .post(controller.create)

router
   .route('/:cityId')
   .get(controller.get)
   .patch(controller.update)
   .delete(controller.remove);

router   
   .route('/:cityId/movies')
   .get(movieServices.getMoviesInCity,controller.getMoviesInCity)

module.exports = router;
