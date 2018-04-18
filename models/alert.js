const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   Alert:
 *     type: object
 *     description: this model represents the Alerts
 *     required:
 *       - receiver
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       message:
 *         type: string
 *         description: who receive the Alert
 *       description:
 *         type: string
 *         description: Alert description
 *       community:
 *         type: string
 *         description: Alert to certain community
 *       author:
 *         type: string
 *         description: Author!
 */
const ALERT_KIND = ["INCIDENT", "INFORMATION", "OTHER"];

const AlertSchema = new Schema(
  {
    message: {
      type: String,
      fake: "lorem.sentence",
      required: true
    },
    description: {
      type: String,
      fake: "lorem.sentence",
      required: true
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true
    },
    kind: {
      type: String,
      default: "INCIDENT",
      enum: ALERT_KIND,
      required: true
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at" },
    fakeCreatedAt: { from: "01-01-2018", to: "12-31-2018" }
  }
);

AlertSchema.post("save", function(next) {
  console.log("Call Notifier With", this.receiver);
});

module.exports = mongoose.model("Alert", AlertSchema);
