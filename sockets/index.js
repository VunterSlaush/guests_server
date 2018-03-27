const initIO = require("socket.io");
const redis = require("../redis");
const handler = require("../utils/socketHandler");

let io;

function init(app) {
	io = initIO(app);
	io.on("connection", handler(onConnection, socket => [io, socket]));
	return io;
}

function onConnection(io, socket) {
	socket.on("disconnect", handler(disconnect, data => [socket, data]));
	socket.on("login", handler(login, data => [socket]));
}

async function login(socket, data) {
	console.log("Login", socket.id, data.id);
	await redis.set(data.id, socket.id);
	await redis.set(socket.id, data.id);
}

async function disconnect(socket) {
	const userId = await redis.getAsync(socket.id);
	await redis.delAsync(userId);
	await redis.delAsync(socket.id);
}

module.exports = { init, io };
