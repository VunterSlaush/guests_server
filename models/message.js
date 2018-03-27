const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   Message:
 *     type: object
 *     required:
 *       - sender
 *       - conversation
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       text:
 *         type: string
 *       image:
 *         type: array
 *         items:
 *           type: string
 *           description: an url to image upload
 *       sender:
 *         readOnly: true
 *         type: string
 *         description: an id ref to User
 *       conversation:
 *         readOnly: true
 *         type: string
 *         description: an id ref to Conversation
 */
const MessageSchema = new Schema(
	{
		text: {
			type: String,
			required: true,
			maxlength: 1000,
			fake: "lorem.sentence"
		},
		image: [{ type: String, fake: "internet.avatar" }], // string Array !
		sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
		conversation: {
			type: Schema.Types.ObjectId,
			ref: "Conversation",
			required: true
		}
	},
	{
		timestamps: { createdAt: "created_at" }
	}
);

//Export model
module.exports = mongoose.model("Message", MessageSchema);
