const Seat = require("@models/seat.model")
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { omit } = require('lodash');
const { relativeTimeRounding } = require("moment");


/**
 * Load Seat and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const seat = await Seat.get(id);
        if(seat.isDeleted){
            return next(new APIError({message:"Sorry Seat deleted"}));
        }else{
            req.locals = { seat };
            return next();
        }
    } catch (error) {
        return next(new APIError(error));
    }
 };

 /**
 * Get seat obj
 * @public
 */
exports.get = (req, res) => res.json(req.locals.seat);


/**
 * Update existing seat
 * @public
 */
exports.update = (req, res, next) => {
    const updatedSeat = omit(req.body);
    const seat_ = Object.assign(req.locals.seat, updatedSeat);

    seat_.save()
       .then(savedSeat => res.json(savedSeat))
       .catch(e => next(new APIError(e)));
 };

/**
 * Create new seat obj
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        req.body.history = [{
            action :"AVAILABLE",
            executeAt:new Date()
        }]
        const seat = new Seat(req.body);
        const savedseat = await seat.save();
        res.status(httpStatus.CREATED);
        return res.json(savedseat.transform());
    } catch (error) {
        return next(new APIError(error));
    }
 };



/**
 * remove new seat obj
 * @public
 */
exports.remove = async (req, res, next) => {
    //permanant delete procust
    // const { seat } = req.locals;

    // seat.remove()
    //   .then(() => res.status(httpStatus.NO_CONTENT).end())
    //   .catch(e => next(new APIError(error)));

    //vertual deleted seat
    const updatedSeat = omit({isDeleted:true});
    const seat_ = Object.assign(req.locals.seat, updatedSeat);

    seat_.save()
       .then(savedSeat => res.json(savedSeat))
       .catch(e => next(new APIError(e)));
};

  /**
 * Get feed list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
        let seats = await Seat.list(req.query);
        return res.json(seats)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 
/**
 * Update existing seat
 * @public
 */
 exports.bookTicket = (req, res, next) => {
     if(!req.locals.seat.isBooked){  
         let { entity } = req.session
         req.body.bookedBy = entity
         req.body.isBooked = true
         req.body.bookedAt = Date.now()
         const updatedSeat = omit(req.body);
         const seat_ = Object.assign(req.locals.seat, updatedSeat);
         seat_.save()
             .then(savedSeat => res.json(savedSeat))
             .catch(e => next(new APIError(e)));
     }else{
         return next(new APIError({message:"Already booked"}))
     }
 };