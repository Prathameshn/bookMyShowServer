const APIError = require('@utils/APIError');
const Movie = require("@models/movie.model")

exports.getMoviesInCity = async(req,res,next)=>{
    try{
        let { city } = req.locals
        let movies =await Movie.find({city:{$elemMatch:{$eq:city._id}}},{city:0})
        if(req.locals){
            req.locals.movies = movies
        }else{
            req.locals = {movies}
        }
        return next()
    }catch(error){
        return next(new APIError(error))
    }
}