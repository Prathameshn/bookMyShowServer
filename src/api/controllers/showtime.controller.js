const Showtime = require("@models/showtime.model")
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { omit } = require('lodash');


/**
 * Load Showtime and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const showtime = await Showtime.get(id);
        if(showtime.isDeleted){
            return next(new APIError({message:"Sorry Showtime deleted"}));
        }else{
            req.locals = { showtime };
            return next();
        }
    } catch (error) {
        return next(new APIError(error));
    }
 };

 /**
 * Get showtime obj
 * @public
 */
exports.get = (req, res) => res.json(req.locals.showtime);


/**
 * Update existing showtime
 * @public
 */
exports.update = (req, res, next) => {
    const updatedShowtime = omit(req.body);
    const showtime_ = Object.assign(req.locals.showtime, updatedShowtime);

    showtime_.save()
       .then(savedShowtime => res.json(savedShowtime))
       .catch(e => next(new APIError(e)));
 };

/**
 * Create new showtime obj
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        req.body.history = [{
            action :"AVAILABLE",
            executeAt:new Date()
        }]
        const showtime = new Showtime(req.body);
        const savedshowtime = await showtime.save();
        res.status(httpStatus.CREATED);
        return res.json(savedshowtime.transform());
    } catch (error) {
        return next(new APIError(error));
    }
 };



/**
 * remove new showtime obj
 * @public
 */
exports.remove = async (req, res, next) => {
    //permanant delete procust
    // const { showtime } = req.locals;

    // showtime.remove()
    //   .then(() => res.status(httpStatus.NO_CONTENT).end())
    //   .catch(e => next(new APIError(error)));

    //vertual deleted showtime
    const updatedShowtime = omit({isDeleted:true});
    const showtime_ = Object.assign(req.locals.showtime, updatedShowtime);

    showtime_.save()
       .then(savedShowtime => res.json(savedShowtime))
       .catch(e => next(new APIError(e)));
};

  /**
 * Get feed list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        let { isDeleted } = req.query
        req.query.isDeleted = isDeleted ? isDeleted: false
        let showtimes = await Showtime.list(req.query);
        return res.json(showtimes)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 