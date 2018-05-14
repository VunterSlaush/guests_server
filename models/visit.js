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
 *       - guest
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       resident:
 *         type: string
 *         readOnly: true
 *         description: who send the Visit request
 *       guest:
 *         type: string
 *         description: who is Guest
 *       community:
 *         type: string
 *         description: the Id Of the comunity
 *       dayOfVisit:
 *         type: string
 *         format: date
 *         description: Day of Visit!
 *       kind:
 *         type: string
 *         description: the type of visit
 *         enum: [SCHEDULED, FREQUENT, NOT EXPECTED, SPORADIC]
 *       companions:
 *         type: integer
 *         description: how many people came with the guest.
 *       partOfDay:
 *         type: string
 *         enum: [MORNING, AFTERNOON, NIGHT]
 *       intervals:
 *         type: array
 *         items:
 *           schema:
 *              $ref: '#/definitions/Interval'
 */

const VISIT_KIND = ["SCHEDULED", "FREQUENT", "NOT EXPECTED", "SPORADIC"];
const PART_OF_DAYS = ["MORNING", "AFTERNOON", "NIGHT"];

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
    dayOfVisit: { type: Date, fake: "date.future" },
    companions: { type: Number, fake: "ramdon.number" },
    partOfDay: { type: String, enum: PART_OF_DAYS, default: "AFTERNOON" },
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
    fakeCreatedAt: { from: "01-01-2018", to: "12-31-2018" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

VisitSchema.statics.residentSelector =
  "guest community dayOfVisit intervals kind";

module.exports = mongoose.model("Visit", VisitSchema);
