const models = require("./models");
const mseed = require("m-seeds");
const COUNT = process.argv[2] || 1;
const SELECTED_MODEL = process.argv[3];

const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URI || "mongodb://127.0.0.1/guests";
mongoose.connect(mongoDB, {});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

mseed.setModels(models);

if (SELECTED_MODEL) {
  mseed.seed(models[generateModelName(SELECTED_MODEL)], COUNT);
} else {
  mseed.seedAll(COUNT);
}

function generateModelName(modelName) {
  return (
    modelName.charAt(0).toUpperCase() + modelName.substring(1).toLowerCase()
  );
}
