const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Address = require("./address.js");
const bcrypt = require("bcrypt-nodejs");
mongoose.Promise = global.Promise;
const Promise = require("bluebird");
/**
 * @swagger
 * definitions:
 *   Company:
 *     type: object
 *     required:
 *       - name
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       name:
 *         type: string
 *       phone:
 *         type: string
 *       image:
 *         type: string
 *       address:
 *         $ref: '#/definitions/Address'
 */

const CompanySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: [validateNoNumbers, "names cannot have numbers"],
      maxlength: 100,
      unique: true,
      fake: "company.companyName"
    },
    address: {
      type: Address
    },
    image: { type: String, fake: "internet.avatar" },
    phone: { type: String, fake: "phone.phoneNumber" }
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// ----- Model Statics ---------- //
CompanySchema.statics.Selector = "_id name image";

CompanySchema.statics.findOneOrCreate = async function findOneOrCreate(
  condition,
  params
) {
  const self = this;
  let u = await self.findOne(condition);
  if (!u) u = await self.create(params);
  await u.save();
  return u;
};

function validateNoNumbers(field) {
  return !/\d/.test(field);
}

module.exports = mongoose.model("Company", CompanySchema);
