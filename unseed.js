const models = require("./models");
const client = require("./elastic/client");
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI || "mongodb://127.0.0.1/jobchat";
mongoose.connect(mongoDB, {});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

async function unseed() {
  for (key in models) {
    try {
      await models[key].remove({});
      console.log("removed", key);
    } catch (e) {
      console.log("not removed", key);
    }
  }
}

unseed();
