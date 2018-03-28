const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const GoogleMapClient = require("../utils/GoogleMapClient");
const ApiError = require("../utils/ApiError");
const countryjs = require("countryjs");
/**
 * @swagger
 * definitions:
 *   Address:
 *     type: object
 *     required:
 *       - country
 *       - state
 *       - zip
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       country:
 *         type: string
 *       state:
 *         type: string
 *       city:
 *         type: string
 *       zip:
 *         type: string
 *       geopos:
 *         type: array
 *         items:
 *           type: number
 *
 */

const AddressSchema = new Schema(
  {
    country: {
      type: String,
      required: true,
      maxlength: 100,
      fake: "address.country"
    },
    fullAddress: {
      type: String
    },
    countryCode: {
      type: String,
      maxlength: 4
    },
    city: {
      type: String,
      fake: "address.city"
    },
    state: {
      type: String,
      required: true,
      fake: "address.state"
    },
    zip: {
      type: String,

      fake: "address.zipCode"
    },
    geoPos: {
      type: [Number], // [<longitude>, <latitude>]
      index: "2d" // create the geospatial index
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

AddressSchema.set("toJSON", {
  virtuals: true
});

AddressSchema.methods.calculatefullAddress = function() {
  if (!this.fullAddress) {
    const zip = this.zip ? this.zip + ", " : "";
    const city = this.city ? this.city + ", " : "";
    this.fullAddress = zip + city + this.state + ", " + this.country;
  }
};

AddressSchema.methods.calculateCountryCode = function() {
  let country = this.country;
  const arry = countryjs.all().filter(function(doc) {
    return country == doc.name;
  });
  if (arry.length > 0) this.countryCode = arry[0].ISO.alpha2;
};

AddressSchema.pre("save", function(next) {
  this.calculateCountryCode();
  this.calculatefullAddress();
  next();
});

module.exports = AddressSchema;
