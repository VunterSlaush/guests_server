/**
 * Handles controller execution and responds to user (API Express version).
 * Web socket has a similar handler implementation.
 * @param promise Controller Promise. I.e. getUser.
 * @param params A function (req, res, next), all of which are optional
 * that maps our desired controller parameters. I.e. (req) => [req.params.username, ...].
 */
const socketHandler = (promise, params) => async (io, socket, data) => {
	const boundParams = params ? params(io, socket, data) : [];
	try {
		const result = await promise(...boundParams);
		return result || { message: "OK" };
	} catch (error) {
		console.log("Socket Error", error);
	}
};
module.exports = socketHandler;
