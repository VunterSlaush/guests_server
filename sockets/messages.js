const { Conversation } = require("../models");

module.exports = function(io, clients) {
	async function sendMessage(conversationId, from, text) {
		const conversation = await Conversation.findOne({ _id: conversationId });
		let receiver;
		for (var i = 0; i < conversation.participants.length; i++) {
			if (participants[id].toString().equals(from.toString())) continue;
			receiver = await clients.get(participants[i]);
			io.sockets.connected[socketId].emit("message", {
				from,
				text,
				conversation
			});
		}
	}

	return {
		sendMessage
	};
};
