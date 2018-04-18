const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   Interval:
 *     type: object
 *     required:
 *       - day
 *       - from
 *       - to
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       day:
 *         type: number
 *         description: dia de la semana!
 *       from:
 *         type: number
 *       to:
 *         type: number
 */
const DAYS_OF_WEEK = [1, 2, 3, 4, 5, 6, 7];
const IntervalSchema = new Schema(
  {
    day: {
      type: Number,
      required: true,
      maxlength: 100,
      enum: DAYS_OF_WEEK
    },
    from: {
      type: Number,
      required: true,
      fake: "random.number"
    },
    to: {
      type: Number,
      required: true,
      fake: "random.number"
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = IntervalSchema;
