const redis = require("redis");
const bluebird = require("bluebird");

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var port = process.env.REDIS_PORT || 6379;
var host = process.env.REDIS_HOST || "127.0.0.1";
module.exports = redis.createClient(port, host);
