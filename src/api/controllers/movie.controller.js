const Movie = require("@models/movie.model")
const APIError = require('@utils/APIError');
const httpStatus = require('http-status');
const { omit } = require('lodash');


/**
 * Load Movie and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
    try {
        const movie = await Movie.get(id);
        if(movie.isDeleted){
            return next(new APIError({message:"Sorry Movie deleted"}));
        }else{
            req.locals = { movie };
            return next();
        }
    } catch (error) {
        return next(new APIError(error));
    }
 };

 /**
 * Get movie obj
 * @public
 */
exports.get = (req, res) => res.json(req.locals.movie);


/**
 * Update existing movie
 * @public
 */
exports.update = (req, res, next) => {
    const updatedMovie = omit(req.body);
    const movie_ = Object.assign(req.locals.movie, updatedMovie);

    movie_.save()
       .then(savedMovie => res.json(savedMovie))
       .catch(e => next(new APIError(e)));
 };

/**
 * Create new movie obj
 * @public
 */
exports.create = async (req, res, next) => {
    try {
        req.body.history = [{
            action :"AVAILABLE",
            executeAt:new Date()
        }]
        const movie = new Movie(req.body);
        const savedmovie = await movie.save();
        res.status(httpStatus.CREATED);
        return res.json(savedmovie.transform());
    } catch (error) {
        return next(new APIError(error));
    }
 };



/**
 * remove new movie obj
 * @public
 */
exports.remove = async (req, res, next) => {
    //permanant delete procust
    // const { movie } = req.locals;

    // movie.remove()
    //   .then(() => res.status(httpStatus.NO_CONTENT).end())
    //   .catch(e => next(new APIError(error)));

    //vertual deleted movie
    const updatedMovie = omit({isDeleted:true});
    const movie_ = Object.assign(req.locals.movie, updatedMovie);

    movie_.save()
       .then(savedMovie => res.json(savedMovie))
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
        let movies = await Movie.list(req.query);
        return res.json(movies)
    } catch (error) { 
       next(new APIError(error));
    }
 };
 