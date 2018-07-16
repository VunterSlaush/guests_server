const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Address = require("./address.js");
const bcrypt = require("bcrypt-nodejs");
mongoose.Promise = global.Promise;
const Promise = require("bluebird");
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     required:
 *       - identification
 *       - name
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       identification:
 *         type: string
 *       name:
 *         type: string
 *       email:
 *         type: string
 *         format: email
 *       password:
 *         type: string
 *       cellPhone:
 *         type: string
 *       homePhone:
 *         type: string
 *       workPhone:
 *         type: string
 *       address:
 *         $ref: '#/definitions/Address'
 */

function encrypt(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

const UserSchema = new Schema(
  {
    identification: { type: String, fake: "phone.phoneNumber", unique: true },
    name: {
      type: String,
      required: true,
      validate: [validateNoNumbers, "names cannot have numbers"],
      maxlength: 100,
      fake: "name.findName",
      es_indexed: true
    },
    code: {
      type: Number
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      fake: "internet.email",
      validate: [emailValidator, ""]
    },
    devices: [String],
    password: {
      type: String,
      set: encrypt,
      default: "",
      fake: "internet.password"
    },
    address: {
      type: Address
    },
    image: { type: String, fake: "internet.avatar" },
    timezone: {
      type: String
    },
    cellPhone: { type: String, fake: "phone.phoneNumber" },
    homePhone: { type: String, fake: "phone.phoneNumber" },
    workPhone: { type: String, fake: "phone.phoneNumber" }
  },
  {
    timestamps: { createdAt: "created_at" },
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// ----- Model Mehods ---------- //
UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

// ----- Model Statics ---------- //
UserSchema.statics.Selector = "_id name identification image";

UserSchema.statics.findOneOrCreate = async function findOneOrCreate(
  condition,
  params
) {
  const self = this;
  let u = await self.findOne(condition);
  if (!u) u = await self.create(params);
  await u.save();
  return u;
};

function emailValidator(email) {
  var emailRgx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  return emailRgx.test(email);
}

function validateNoNumbers(field) {
  return !/\d/.test(field);
}

module.exports = mongoose.model("User", UserSchema);
