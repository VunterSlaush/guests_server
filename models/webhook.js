const mongoose = require("mongoose");
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

/**
 * @swagger
 * definitions:
 *   Webhook:
 *     type: object
 *     required:
 *       - endpoint
 *       - eventType
 *       - community
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       endpoint:
 *         type: string
 *       eventType:
 *         type: string
 *         enum: [ON_NEW_RESIDENT, ON_NEW_VISIT, ON_ACCESS]
 *       community:
 *         type: string
 */

const EVENTS_TYPE = ["ON_NEW_RESIDENT", "ON_NEW_VISIT", "ON_ACCESS"];

const WebhookSchema = new Schema(
  {
    endpoint: {
      type: String,
      required: true,
      validate: [validateEndpoint, "it must be an URL!"],
      fake: "internet.url"
    },
    eventType: {
      required: true,
      type: String,
      enum: EVENTS_TYPE
    },
    community: {
      type: Schema.Types.ObjectId,
      ref: "Community",
      required: true
    }
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

function validateEndpoint(field) {
  return /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi.test(
    field
  );
}

module.exports = mongoose.model("Webhook", WebhookSchema);
