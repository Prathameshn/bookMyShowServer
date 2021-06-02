const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('@utils/APIError');

var cinemaSchema = new Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required: true
    },
    city:{ 
        type: Schema.Types.ObjectId, 
        ref: "City" 
    },
    movies:[{ 
      type: Schema.Types.ObjectId, 
      ref: "Movie" 
    }],
    description:{
      type:String
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
},
   { timestamps: true }
)

cinemaSchema.index({ name: 1,city:1 }, { unique: true });

cinemaSchema.method({
   transform() {
      const transformed = {};
      const fields = ['id','name','city','movies','isDeleted','updatedAt','createdAt'];

      fields.forEach((field) => {
         transformed[field] = this[field];
      });

      return transformed;
   },
})

cinemaSchema.statics = {
   /**
      * Get cinema Type
      *
      * @param {ObjectId} id - The objectId of cinema Type.
      * @returns {Promise<User, APIError>}
      */
   async get(id) {
      try {
         let cinema;
         if (mongoose.Types.ObjectId.isValid(id)) {
            cinema = await this.findById(id).exec();
         }
         if (cinema) {
            return cinema;
         }

         throw new APIError({
            message: 'Cinema does not exist',
            status: httpStatus.NOT_FOUND,
         });
      } catch (error) {
         throw error;
      }
   },

   /**
      * List cinema Types in descending order of 'createdAt' timestamp.
      *
      * @param {number} skip - Number of cinema types to be skipped.
      * @param {number} limit - Limit number of cinema types to be returned.
      * @returns {Promise<Subject[]>}
      */
   async list({ page = 1, perPage = 30, name,isDeleted,cinemaKeeper }) {
      let options = omitBy({ isDeleted,cinemaKeeper }, isNil);
      if(name && name.length){
         let queryArr = []
         queryArr.push({ "name": { $regex: name, $options: 'i' } })
         queryArr.push({ "location": { $regex: name, $options: 'i' } })
         queryArr.push({ "phone": { $regex: name, $options: 'i' } })
         options = { $and: [options, { $or: queryArr }] }
       }
      let cinemas = await this.find(options)
         .sort({ createdAt:-1 })
         .skip(perPage * (page * 1 - 1))
         .limit(perPage * 1)
         .exec();
      cinemas = cinemas.map(cinema => cinema.transform())
      var count = await this.find(options).exec();
      count = count.length;
      var pages = Math.ceil(count / perPage);

      return { cinemas, count, pages }

   },
};


module.exports = mongoose.model('Cinema', cinemaSchema);
