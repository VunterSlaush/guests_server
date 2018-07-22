const { Community, CommunityUser, User, Visit } = require("../models");
const { findIfUserIsGranted, findIfUserIsCommunitySecure } = require("./utils");
const moment = require("moment-timezone");
const mongoose = require("mongoose");

async function visitsTypeCountByMonth(community, month, user) {
  const from = moment()
    .tz(user.timezone)
    .date(1)
    .month(month - 1)
    .format("YYYY-MM-DD");

  const to = moment(from).add(30, "days");
  const scheduled = await countByType(community, from, to, "SCHEDULED");
  const frequnt = await countByType(community, from, to, "FREQUENT");
  const sporadic = await countByType(community, from, to, "SPORADIC");
  const not_expected = await countByType(community, from, to, "NOT EXPECTED");
  return { scheduled, frequnt, sporadic, not_expected };
}

async function visitCountByMonth(community, month, user) {
  let from = moment()
    .tz(user.timezone)
    .date(1)
    .month(month - 1)
    .format("YYYY-MM-DD");
  let to = moment(from).add(7, "days");
  const total = [];
  for (let i = 0; i < 4; i++) {
    total[i] = await countByType(community, from, to);
    from = to;
    to = moment(to).add(7, "days");
  }
  return total;
}

async function countByType(community, from, to, type) {
  const visits = findVisitsBetween(community, from, to, type);
  return visits.length;
}

async function findVisitsBetween(community, from, to, type) {
  const match = {
    community: mongoose.Types.ObjectId(community),
    "checks.created_at": {
      $gte: new Date(from),
      $lt: new Date(to)
    }
  };

  if (type) match.kind = type;

  return await Visit.aggregate([
    {
      $lookup: {
        from: "checks",
        localField: "_id",
        foreignField: "visit",
        as: "checks"
      }
    },
    {
      $match: match
    }
  ]);
}
async function countByPartOfDay(community, month, user) {
  const from = moment()
    .tz(user.timezone)
    .date(1)
    .month(month - 1)
    .format("YYYY-MM-DD");

  const to = moment(from).add(30, "days");
  const visits = await findVisitsBetween(community, from, to);
  return {
    "ALL DAY": visits.filter(i => i.partOfDay === "ALL DAY").length,
    MORNING: visits.filter(i => i.partOfDay === "MORNING").length,
    NIGHT: visits.filter(i => i.partOfDay === "NIGHT").length,
    AFTERNOON: visits.filter(i => i.partOfDay === "AFTERNOON").length,
    NULL: visits.filter(i => !i.partOfDay).length
  };
}

module.exports = {
  visitCountByMonth,
  visitsTypeCountByMonth,
  countByPartOfDay
};
