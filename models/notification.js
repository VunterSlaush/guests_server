const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

/**
 * @swagger
 * definitions:
 *   Notification:
 *     type: object
 *     description: this model represents the notifications
 *     required:
 *       - receiver
 *     properties:
 *       id:
 *         type: string
 *         readOnly: true
 *       receiver:
 *         type: string
 *         readOnly: true
 *         description: who receive the notification
 *       text:
 *         type: string
 *         description: notification description
 */

const NotificationSchema = new Schema(
	{
		text: {
			type: String,
			fake: "lorem.sentence",
			required: true
		},
		receiver: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true
		}
	},
	{
		timestamps: { createdAt: "created_at" }
	}
);

NotificationSchema.post("save", function(next) {
	console.log("Call Notifier With", this.receiver);
});

module.exports = mongoose.model("Notification", NotificationSchema);
