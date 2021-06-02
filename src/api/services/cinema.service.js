const APIError = require('@utils/APIError');
const Cinema = require("@models/cinema.model")

exports.getCinemaForMovie = async(req,res,next)=>{
    try{
        let { movie } = req.locals
        let { city } = req.query
        let cinemas =await Cinema.find({city,movies:{$elemMatch:{$eq:movie._id}}},{movies:0})
        if(req.locals){
            req.locals.cinemas = cinemas
        }else{
            req.locals = {cinemas}
        }
        return next()
    }catch(error){
        return next(new APIError(error))
    }
}