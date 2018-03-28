const { Visit, Check } = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const { findIfUserIsOnCommunity } = require("./utils");
async function create(resident, guest, community, kind, intervals) {
  try {
    findIfUserIsOnCommunity(community, resident);
    let visit = new Visit({ resident, guest, community, kind, intervals });
    await visit.save();
    return visit;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function update() {}

async function check(visit, type) {
  const check = new Check({ visit, type });
  await check.save();
  return check;
}

async function guestIsScheduled(guest) {
  // TODO Evaluate if can access or not ..
  const visit = Visit.findOne({ guest }).sort({ created_at: -1 });
  return visit;
}

async function findByResident(resident, skip, limit) {
  return await Visit.find({ resident })
    .sort({ created_at: -1 })
    .limit(limit)
    .skip(skip);
}

module.exports = {
  create,
  update,
  checkIn,
  checkOut,
  findByResident
};
