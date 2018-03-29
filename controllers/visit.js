const { Visit, Check } = require("../models");
const ApiError = require("../utils/ApiError");
const moment = require("moment");
const {
  findIfUserIsOnCommunity,
  findIfUserIsCommunitySecure
} = require("./utils");

async function create(resident, guest, community, kind, intervals, dayOfVisit) {
  try {
    await findIfUserIsOnCommunity(community, resident);
    let visit = new Visit({
      resident,
      guest,
      community,
      kind,
      intervals,
      dayOfVisit: new Date(dayOfVisit)
    });
    await visit.save();
    return visit;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function update() {
  /* TODO*/
}

async function check(visit, type) {
  const check = new Check({ visit, type });
  await check.save();
  return check;
}

async function guestIsScheduled(community, guest, userWhoAsk) {
  await findIfUserIsCommunitySecure(community, userWhoAsk);
  const visit = await Visit.find({
    guest: guest,
    community: community
  }).sort({
    created_at: -1
  });
  const visitsFiltered = visit.filter(item => evaluateVisit(item));
  return visitsFiltered;
}

function evaluateVisit(visit) {
  switch (visit.kind) {
    case "SCHEDULED":
      return evaluateScheduled(visit);
      break;
    case "FREQUENT":
      return evaluateFrequent(visit);
      break;
    case "SPORADIC":
      return true;
      break;
    default:
  }
}

function evaluateScheduled(visit) {
  const now = moment();
  const visitDay = moment(visit.dayOfVisit);
  const diff = now.diff(visitDay, "days");
  return diff <= 0;
}

function evaluateFrequent(visit) {
  const { intervals } = visit;
  const now = moment();
  const day = now.day();
  const hour = now.hour() * 100 + now.minutes();
  return (
    intervals.filter(
      item => item.day == day && item.from <= hour && item.to >= hour
    ).length > 0
  );
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
  check,
  guestIsScheduled,
  findByResident
};
