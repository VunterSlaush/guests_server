const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require("./user");
mongoose.Promise = global.Promise;

/**
 * @swagger
 * definitions:
 *   Post:
 *     type: object
 *     required:
 *       - content
 *       - community
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       content:
 *         type: string
 *       images:
 *         type: array
 *         items:
 *           type: string
 *       community:
 *         type: string
 *         readOnly: true
 *         description: an id ref to Community
 */

const PostSchema = new Schema(
  {
    images: [{ type: String, fake: "internet.avatar" }],
    content: {
      type: String,
      required: true,
      maxlength: 1000,
      fake: "lorem.text"
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

module.exports = mongoose.model("Post", PostSchema);
