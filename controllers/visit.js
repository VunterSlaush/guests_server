const { Visit, Check, User, Community, Company } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const moment = require("moment");
const {
  findIfUserIsOnCommunity,
  findIfUserIsCommunitySecure
} = require("./utils");

async function create({
  resident,
  identification,
  name,
  community,
  kind,
  intervals,
  companions,
  partOfDay,
  dayOfVisit
}) {
  try {
    await findIfUserIsOnCommunity(community, resident);

    const guest = await findOrCreateGuest(identification, name, kind);

    let visit = new Visit({
      resident,
      guest: guest._id,
      community,
      kind,
      guestType: kind == "SPORADIC" ? "Company" : "User"
    });

    if (kind == "SCHEDULED") {
      visit.dayOfVisit = new Date(dayOfVisit);
      visit.companions = companions;
      visit.partOfDay = partOfDay;
    }

    if (kind == "FREQUENT") visit.intervals = intervals;

    await visit.save();
    await populateVisit(visit);
    return visit;
  } catch (e) {
    console.log("E", e);
    throw new ApiError("Error en los datos ingresados", 400);
  }
}

async function populateVisit(visit) {
  if (visit.kind == "SPORADIC")
    await Company.populate(visit, { path: "guest" });
  else await User.populate(visit, { path: "guest" });

  await User.populate(visit, { path: "resident" });
  await Community.populate(visit, { path: "community" });
}

async function findOrCreateGuest(identification, name, kind) {
  if (kind == "SPORADIC")
    return await Company.findOneOrCreate({ name }, { name });
  else
    return await User.findOneOrCreate(
      { identification },
      { identification, name }
    );
}

async function update(visitId, info, user) {
  const visit = await Visit.findOne({ _id: visitId, resident: user.id });
  if (!visit) throw new ApiError("Visita no encontrada", 404);
  visit.set(info);
  await visit.save();
  return visit;
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
    case "SPORADIC": // TODO FIND IS NOT CHECKED!
      return true;
      break;
    default:
  }
}

function evaluateScheduled(visit) {
  // TODO find is not Checked!
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

async function findByResident(resident, kind, skip, limit) {
  let visits;
  if (kind != "SCHEDULED") {
    visits = await Visit.find({ resident, kind })
      .select(Visit.residentSelector)
      .populate({
        path: "guest",
        model: kind == "SPORADIC" ? "Company" : "User"
      })
      .populate("community")
      .sort({ created_at: -1 })
      .limit(limit)
      .skip(skip);
  } else {
    visits = await Visit.aggregate([
      {
        $match: {
          resident: mongoose.Types.ObjectId(resident),
          kind,
          dayOfVisit: { $gte: new Date() }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "guest",
          foreignField: "_id",
          as: "guest"
        }
      },
      {
        $lookup: {
          from: "communities",
          localField: "community",
          foreignField: "_id",
          as: "community"
        }
      },
      {
        $lookup: {
          from: "checks",
          localField: "_id",
          foreignField: "visit",
          as: "checks"
        }
      },
      {
        $match: {
          checks: { $size: 0 }
        }
      },
      {
        $unwind: "$community"
      },
      {
        $unwind: "$guest"
      },
      {
        $project: {
          resident: 0
        }
      },
      { $sort: { created_at: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);
  }
  return { visits };
}

async function destroy(visit, user) {
  const visitInstance = Visit.find({ _id: visit, resident: user });
  if (!visitInstance) throw new ApiError("unauthorized", 401);
  return await visitInstance.remove();
}

module.exports = {
  create,
  update,
  check,
  destroy,
  guestIsScheduled,
  findByResident
};
