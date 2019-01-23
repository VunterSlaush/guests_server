const models = require("./models");

const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI || "mongodb://local:mota123@ds157475.mlab.com:57475/heroku_f5xnh953";
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
