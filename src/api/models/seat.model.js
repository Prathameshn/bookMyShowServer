const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('@utils/APIError');

var seatSchema = new Schema({
    seatNumber:{
        type:Number,
        required: true
    },
    showtime:{
      type: Schema.Types.ObjectId, 
      ref: "Showtime" 
    },
    description:{
      type:String
    },
    isBooked:{
      type:Boolean,
      default:false
   },
   bookedBy:{
      type: Schema.Types.ObjectId, 
      ref: "User" 
   }
},
   { timestamps: true }
)

seatSchema.index({ seatNumber:1, showtime:1 }, { unique: true });

seatSchema.method({
   transform() {
      const transformed = {};
      const fields = ['id','seatNumber','showtime','city','isDeleted','updatedAt','createdAt'];

      fields.forEach((field) => {
         transformed[field] = this[field];
      });

      return transformed;
   },
})

seatSchema.statics = {
   /**
      * Get seat Type
      *
      * @param {ObjectId} id - The objectId of seat Type.
      * @returns {Promise<User, APIError>}
      */
   async get(id) {
      try {
         let seat;
         if (mongoose.Types.ObjectId.isValid(id)) {
            seat = await this.findById(id).exec();
         }
         if (seat) {
            return seat;
         }

         throw new APIError({
            message: 'Seat does not exist',
            status: httpStatus.NOT_FOUND,
         });
      } catch (error) {
         throw error;
      }
   },

   /**
      * List seat Types in descending order of 'createdAt' timestamp.
      *
      * @param {number} skip - Number of seat types to be skipped.
      * @param {number} limit - Limit number of seat types to be returned.
      * @returns {Promise<Subject[]>}
      */
   async list({ page = 1, perPage = 30, name,isDeleted }) {
      let options = omitBy({ isDeleted }, isNil);
      let seats = await this.find(options)
         .sort({ createdAt: -1 })
         .skip(perPage * (page * 1 - 1))
         .limit(perPage * 1)
         .exec();
      seats = seats.map(seat => seat.transform())
      var count = await this.find(options).exec();
      count = count.length;
      var pages = Math.ceil(count / perPage);

      return { seats, count, pages }

   },
};


module.exports = mongoose.model('Seat', seatSchema);
