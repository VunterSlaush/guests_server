const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const Interval = require("./interval.js");
/**
 * @swagger
 * definitions:
 *   Visit:
 *     type: object
 *     description: this model represents the Visits between users
 *     required:
 *       - sender
 *       - receiver
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       sender:
 *         type: string
 *         readOnly: true
 *         description: who send the Visit request
 *       receiver:
 *         type: string
 *         readOnly: true
 *         description: who receive the Visit request
 *       approved:
 *         type: boolean
 *         description: the status of the Visit request
 */

const VISIT_KIND = ["SCHEDULED", "FREQUENT", "NOT EXPECTED", "SPORADIC"];

const VisitSchema = new Schema(
  {
    resident: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    guest: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    day: { type: Date },
    intervals: [Interval],
    kind: {
      type: String,
      default: "SCHEDULED",
      enum: VISIT_KIND,
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = mongoose.model("Visit", VisitSchema);
