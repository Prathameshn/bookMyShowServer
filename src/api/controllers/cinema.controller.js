const Cinema = require("@models/cinema.model")
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { omit } = require('lodash');


/**
 * Load Cinema and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const cinema = await Cinema.get(id);
        if(cinema.isDeleted){
            return next(new APIError({message:"Sorry Cinema deleted"}));
        }else{
            req.locals = { cinema };
            return next();
        }
    } catch (error) {
        return next(new APIError(error));
    }
 };

 /**
 * Get cinema obj
 * @public
 */
exports.get = (req, res) => res.json(req.locals.cinema);


/**
 * Update existing cinema
 * @public
 */
exports.update = (req, res, next) => {
    const updatedCinema = omit(req.body);
    const cinema_ = Object.assign(req.locals.cinema, updatedCinema);

    cinema_.save()
       .then(savedCinema => res.json(savedCinema))
       .catch(e => next(new APIError(e)));
 };

/**
 * Create new cinema obj
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        req.body.history = [{
            action :"AVAILABLE",
            executeAt:new Date()
        }]
        const cinema = new Cinema(req.body);
        const savedcinema = await cinema.save();
        res.status(httpStatus.CREATED);
        return res.json(savedcinema.transform());
    } catch (error) {
        return next(new APIError(error));
    }
 };



/**
 * remove new cinema obj
 * @public
 */
exports.remove = async (req, res, next) => {
    //permanant delete procust
    // const { cinema } = req.locals;

    // cinema.remove()
    //   .then(() => res.status(httpStatus.NO_CONTENT).end())
    //   .catch(e => next(new APIError(error)));

    //vertual deleted cinema
    const updatedCinema = omit({isDeleted:true});
    const cinema_ = Object.assign(req.locals.cinema, updatedCinema);

    cinema_.save()
       .then(savedCinema => res.json(savedCinema))
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
        let cinemas = await Cinema.list(req.query);
        return res.json(cinemas)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 