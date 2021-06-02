const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('@utils/APIError');

var movieSchema = new Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required: true
    },
    description:{
      type:String
    },
    city:{ 
        type: Schema.Types.ObjectId, 
        ref: "City" 
    },
    isDeleted:{
      type:Boolean,
      default:false
    }
},
   { timestamps: true }
)

movieSchema.index({ name: 1 }, { unique: true });

movieSchema.method({
   transform() {
      const transformed = {};
      const fields = ['id','name','description','city','isDeleted','updatedAt','createdAt'];

      fields.forEach((field) => {
         transformed[field] = this[field];
      });

      return transformed;
   },
})

movieSchema.statics = {
   /**
      * Get movie Type
      *
      * @param {ObjectId} id - The objectId of movie Type.
      * @returns {Promise<User, APIError>}
      */
   async get(id) {
      try {
         let movie;
         if (mongoose.Types.ObjectId.isValid(id)) {
            movie = await this.findById(id).populate('movieKeeper').exec();
         }
         if (movie) {
            return movie;
         }

         throw new APIError({
            message: 'Movie does not exist',
            status: httpStatus.NOT_FOUND,
         });
      } catch (error) {
         throw error;
      }
   },

   /**
      * List movie Types in descending order of 'createdAt' timestamp.
      *
      * @param {number} skip - Number of movie types to be skipped.
      * @param {number} limit - Limit number of movie types to be returned.
      * @returns {Promise<Subject[]>}
      */
   async list({ page = 1, perPage = 30, search,isDeleted }) {
      let options = omitBy({ isDeleted,search }, isNil);
      if(search && search.length){
         let queryArr = []
         queryArr.push({ "name": { $regex: search, $options: 'i' } })
         queryArr.push({ "description": { $regex: search, $options: 'i' } })
         options = { $and: [options, { $or: queryArr }] }
       }
      let movies = await this.find(options)
         .sort({ createdAt: -1 })
         .skip(perPage * (page * 1 - 1))
         .limit(perPage * 1)
         .exec();
      movies = movies.map(movie => movie.transform())
      var count = await this.find(options).exec();
      count = count.length;
      var pages = Math.ceil(count / perPage);

      return { movies, count, pages }

   },
};


module.exports = mongoose.model('Movie', movieSchema);
