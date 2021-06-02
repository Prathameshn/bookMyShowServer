const APIError = require('@utils/APIError');
const Showtime = require("@models/showtime.model")
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
exports.checkAvailablity = async(req,res,next)=>{
    try{
        let { from ,to,cinema,movie,numberOfSeat } = req.body
        if(numberOfSeat){
            let showTime = await Showtime.findOne({
                cinema:cinema,
                movie:movie,
                $or:[
                    {from:{$lt:to,$gte:from}},
                    { to:{$gt:from,$lte:to}}
                ]
            })
            if(!showTime){
                return next()
            }else{
                return next(new APIError({message:"Showtime not available,Please change the show time and try to create"}))
            }
        }else{
            return next(new APIError({message:"Please provide number of seats"}))
        }
    }catch(error){
        return next(new APIError(error))
    }
}


//nedd movie id here by query param will show filer for movie
exports.getShowtimeForMovie = async(req,res,next)=>{
    try{
        let { movie } = req.query
        let { cinemaId } = req.params

        let match = {
            cinema:ObjectId(cinemaId)
        }

        if(movie){
            match = {
                cinema:ObjectId(cinemaId),
                movie:ObjectId(movie)
            }
        }

        let showTimes = await Showtime.aggregate([
            {
                $match:match
            },
            {
                $group:{
                    _id:"$movie",
                    showTimes:{
                        $push:"$$ROOT"
                    }
                }
            },
            {
                $lookup:{
                    from:'movies',
                    localField:'_id',
                    foreignField:'_id',
                    as:'movie'
                }
            }
        ])
        
        if(req.locals){
            req.locals.showTimes = showTimes
        }else{
            req.locals = { showTimes }
        }
        return next()
    }catch(error){
        return next(new APIError(error))
    }
}