const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   Interval:
 *     type: object
 *     required:
 *       - country
 *       - state
 *       - zip
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       day:
 *         type: string
 *         description: dia de la semana!
 *       from:
 *         type: number
 *       to:
 *         type: number
 */
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday"
];
const IntervalSchema = new Schema(
  {
    day: {
      type: String,
      required: true,
      maxlength: 100,
      enum: DAYS_OF_WEEK
    },
    from: {
      type: Number,
      required: true
    },
    to: {
      type: Number,
      required: true
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = IntervalSchema;
