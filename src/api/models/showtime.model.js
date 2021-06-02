const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('@utils/APIError');

var showtimeSchema = new Schema({
    from:{
        type:Date,
        required: true
    },
    to:{
      type: Date, 
      required: true
    },
    cinema:{
      type: Schema.Types.ObjectId, 
      ref: "Cinema" 
    },
    movie:{
      type: Schema.Types.ObjectId, 
      ref: "Movie" 
    },
    numberOfSeat:{
      type: Number,
      required:true
    }
},
   { timestamps: true }
)

showtimeSchema.index({ cinema: 1, movie:1, from:1, to:1 }, { unique: true });

showtimeSchema.method({
   transform() {
      const transformed = {};
      const fields = ['id','from','to','cinema','movie','isDeleted','updatedAt','createdAt'];

      fields.forEach((field) => {
         transformed[field] = this[field];
      });

      return transformed;
   },
})

showtimeSchema.statics = {
   /**
      * Get showtime Type
      *
      * @param {ObjectId} id - The objectId of showtime Type.
      * @returns {Promise<User, APIError>}
      */
   async get(id) {
      try {
         let showtime;
         if (mongoose.Types.ObjectId.isValid(id)) {
            showtime = await this.findById(id).exec();
         }
         if (showtime) {
            return showtime;
         }

         throw new APIError({
            message: 'Showtime does not exist',
            status: httpStatus.NOT_FOUND,
         });
      } catch (error) {
         throw error;
      }
   },

   /**
      * List showtime Types in descending order of 'createdAt' timestamp.
      *
      * @param {number} skip - Number of showtime types to be skipped.
      * @param {number} limit - Limit number of showtime types to be returned.
      * @returns {Promise<Subject[]>}
      */
   async list({ page = 1, perPage = 30, name,isDeleted }) {
      let options = omitBy({ isDeleted }, isNil);
      let showtimes = await this.find(options)
         .sort({ createdAt: -1 })
         .skip(perPage * (page * 1 - 1))
         .limit(perPage * 1)
         .exec();
      showtimes = showtimes.map(showtime => showtime.transform())
      var count = await this.find(options).exec();
      count = count.length;
      var pages = Math.ceil(count / perPage);

      return { showtimes, count, pages }

   },
};


module.exports = mongoose.model('Showtime', showtimeSchema);
