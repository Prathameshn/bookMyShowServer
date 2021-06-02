const APIError = require('@utils/APIError');
const Seat = require("@models/seat.model");
const { query } = require('express');

exports.create = async(req,res,next)=>{
    try{
        let { numberOfSeat } = req.body
        let { showTime } = req.locals
        let seats = []
        for(let i=1;i;i++){
            if(i>numberOfSeat){
                console.log(seats)
                let _seats =await Seat.insertMany(seats)
                return res.json(showTime)
                break;
            }
            seats.push({
                seatNumber:i,
                showtime:showTime.id
            })   
        }
    }catch(error){
        return next(new APIError(error))
    }
}


exports.addSeat = async(req,res,next)=>{
    try{
        let { showtime } = req.locals
        let seat = await Seat.findOne({showtime}).limit(1).sort({seatNumber:-1})
        let newSeat = new Seat({
            seatNumber :seat.seatNumber + 1,
            showtime
        })
        newSeat = await newSeat.save()
        return res.json(newSeat)
    }catch(error){
        return next(new APIError(error))
    }
}


exports.getSeatbyShowtime = async(req,res,next)=>{
    try{
        let { showtime } = req.locals
        req.query = {showtime}
        let seats = await Seat.list(req.query)
        return res.json(seats)
    }catch(error){
        return next(new APIError(error))
    }
}