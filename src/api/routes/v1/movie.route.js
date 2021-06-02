const express = require('express');
const controller = require('@controllers/movie.controller');

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

module.exports = router;
