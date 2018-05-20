const { Visit, Check, User, Community, Company } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

async function find(query) {
  return await Company.find({
    authors: { $regex: query, $options: "i" }
  }).limit(30);
}

module.exports = { find };
