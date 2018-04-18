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
const CHECK_TYPES = ["IN", "OUT"];
const CheckSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: CHECK_TYPES
    },
    visit: {
      type: Schema.Types.ObjectId,
      ref: "Visit",
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = mongoose.model("Check", CheckSchema);
