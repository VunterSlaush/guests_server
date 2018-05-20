const { Visit, Check, User, Community, Company } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

async function find(query) {
  const companies = await Company.find({
    authors: { $regex: query, $options: "i" }
  }).limit(30);
  return { companies };
}

module.exports = { find };
