module.exports = function(io, clients) {
	async function notify(to, data) {
		const socketId = await clients.get(to);
		io.sockets.connected[socketId].emit("notification", data);
	}

	return {
		notify
	};
};
