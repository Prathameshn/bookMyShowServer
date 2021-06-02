const City = require("@models/city.model")
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { omit } = require('lodash');


/**
 * Load City and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const city = await City.get(id);
        if(city.isDeleted){
            return next(new APIError({message:"Sorry City deleted"}));
        }else{
            req.locals = { city };
            return next();
        }
    } catch (error) {
        return next(new APIError(error));
    }
 };

 /**
 * Get city obj
 * @public
 */
exports.get = (req, res) => res.json(req.locals.city);


/**
 * Update existing city
 * @public
 */
exports.update = (req, res, next) => {
    const updatedCity = omit(req.body);
    const city_ = Object.assign(req.locals.city, updatedCity);

    city_.save()
       .then(savedCity => res.json(savedCity))
       .catch(e => next(new APIError(e)));
 };

/**
 * Create new city obj
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        req.body.history = [{
            action :"AVAILABLE",
            executeAt:new Date()
        }]
        const city = new City(req.body);
        const savedcity = await city.save();
        res.status(httpStatus.CREATED);
        return res.json(savedcity.transform());
    } catch (error) {
        return next(new APIError(error));
    }
 };



/**
 * remove new city obj
 * @public
 */
exports.remove = async (req, res, next) => {
    //permanant delete procust
    // const { city } = req.locals;

    // city.remove()
    //   .then(() => res.status(httpStatus.NO_CONTENT).end())
    //   .catch(e => next(new APIError(error)));

    //vertual deleted city
    const updatedCity = omit({isDeleted:true});
    const city_ = Object.assign(req.locals.city, updatedCity);

    city_.save()
       .then(savedCity => res.json(savedCity))
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
        let citys = await City.list(req.query);
        return res.json(citys)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 
 exports.getMoviesInCity = async (req, res, next) => {
    try {
        let { movies } = req.locals
        return res.json(movies)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 