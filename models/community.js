const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const Address = require("./address.js");
const Promise = require("bluebird");
/**
 * @swagger
 * definitions:
 *   Community:
 *     type: object
 *     required:
 *       - name
 *       - address
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       name:
 *         type: string
 *       image:
 *         type: string
 *       address:
 *         $ref: '#/definitions/Address'
 */

const CommunitySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 100,
      fake: "address.streetName",
      es_indexed: true,
      es_type: "text"
    },
    image: { type: String, fake: "internet.avatar" },
    address: Address
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

module.exports = mongoose.model("Community", CommunitySchema);
