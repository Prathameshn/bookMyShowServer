const mongoose = require("mongoose")
const Schema = mongoose.Schema
const { omitBy, isNil } = require('lodash');
const httpStatus = require('http-status');
const APIError = require('@utils/APIError');

var citySchema = new Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required: true
    },
    pincode:{
        type:String,
        required: true
    },
    isDeleted:{
      type:Boolean,
      default:false
   }
},
   { timestamps: true }
)

citySchema.index({ pincode: 1 }, { unique: true });

citySchema.method({
   transform() {
      const transformed = {};
      const fields = ['id','name','pincode','isDeleted','updatedAt','createdAt'];

      fields.forEach((field) => {
         transformed[field] = this[field];
      });

      return transformed;
   },
})

citySchema.statics = {
   /**
      * Get city Type
      *
      * @param {ObjectId} id - The objectId of city Type.
      * @returns {Promise<User, APIError>}
      */
   async get(id) {
      try {
         let city;
         if (mongoose.Types.ObjectId.isValid(id)) {
            city = await this.findById(id).exec();
         }
         if (city) {
            return city;
         }

         throw new APIError({
            message: 'City does not exist',
            status: httpStatus.NOT_FOUND,
         });
      } catch (error) {
         throw error;
      }
   },

   /**
      * List city Types in descending order of 'createdAt' timestamp.
      *
      * @param {number} skip - Number of city types to be skipped.
      * @param {number} limit - Limit number of city types to be returned.
      * @returns {Promise<Subject[]>}
      */
   async list({ page = 1, perPage = 100, search ,isDeleted }) {
      let options = omitBy({ isDeleted,search }, isNil);
      let cities = await this.find(options)
         .sort({ createdAt: -1 })
         .skip(perPage * (page * 1 - 1))
         .limit(perPage * 1)
         .exec();
      cities = cities.map(city => city.transform())
      var count = await this.find(options).exec();
      count = count.length;
      var pages = Math.ceil(count / perPage);

      return { cities, count, pages }

   },
};


module.exports = mongoose.model('City', citySchema);
