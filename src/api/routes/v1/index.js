const express = require('express');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const movieRoute = require('./movie.route')
const cityRoute = require('./city.route')
const seatRoute = require('./seat.route')
const showTimeRoute = require('./showtime.route')
const cinemaRoute = require('./cinema.route')

const router = express.Router();

/**
 * GET v1/status
 */
router.get('/status', (req, res) => res.send('OK'));


router.use('/users', userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
