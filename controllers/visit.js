const { Visit } = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");

async function create({ resident, guest, community, kind }) {
  try {
    let visit = new Visit({ resident, guest, community, kind });
    await visit.save();
    return visit;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function checkIn(visitId) {
  const visit = await Visit.findOne({ _id: visitId });
  visit.set({ in: Date.now });
  await visit.save();
  return visit;
}

async function checkOut(visitId) {
  const visit = await Visit.findOne({ _id: visitId });
  visit.set({ out: Date.now });
  await visit.save();
  return visit;
}

async function guestIsScheduled(guest) {
  // TODO Evaluate if can access or not ..
  const visit = Visit.findOne({ guest }).sort({ created_at: -1 });
  return visit;
}

module.exports = {
  create,
  update,
  find
};
