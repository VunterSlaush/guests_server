const { Visit, Check, User, Community, Company } = require("../models");
const { send } = require("../oneSignal");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const Webhook = require("./webhook");
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
  dayOfVisit,
  timezone
}) {
  try {
    await findIfUserIsOnCommunity(community, resident);

    const guest = await findOrCreateGuest(identification, name, kind);

    let visit = new Visit({
      resident,
      guest: guest._id,
      community,
      kind,
      guestType: kind == "SPORADIC" ? "Company" : "User",
      timezone
    });

    if (kind == "SCHEDULED") {
      visit.dayOfVisit = new Date(dayOfVisit);
      visit.companions = companions;
      visit.partOfDay = partOfDay;
    }

    if (kind == "FREQUENT") visit.intervals = intervals;

    await visit.save();
    await populateVisit(visit);
    await Webhook.run(community, "ON_NEW_VISIT", visit);
    return visit;
  } catch (e) {
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
  if (type == "IN") await runAccessWebhooks(visit);
  await check.save();
  return check;
}

async function runAccessWebhooks(visitId) {
  const visit = await Visit.findOne({ _id: visitId });
  await Webhook.run(visit.community, "ON_ACCESS", visit);
}

async function guestIsScheduled(
  community,
  identification,
  email,
  name,
  userWhoAsk
) {
  await findIfUserIsCommunitySecure(community, userWhoAsk);
  const guest = await findGuest(identification, email, name);
  if (!guest) return { error: "Visitante no Existente" };

  const visit = await Visit.find({
    guest: guest.id,
    community
  }).sort({
    created_at: -1
  });

  const visits = await Promise.all(visit.map(item => evaluateVisit(item)));

  const visitsFiltered = visits.filter(item => item != null);

  const visitFounded =
    visitsFiltered.length > 0
      ? await fillVisit(visitsFiltered[0])
      : { error: "Visita no Encontrada" };

  return visitFounded;
}

async function fillVisit(visit) {
  return await Visit.findOne({ _id: visit.id })
    .populate("guest")
    .populate("resident")
    .populate("community");
}

async function findGuest(identification, email, name) {
  const user = await User.findOne({ $or: [{ identification }, { email }] });
  const company = await Company.findOne({ name });
  return user ? user : company;
}

async function evaluateVisit(visit) {
  const check = await Check.findOne({ visit: visit.id });
  switch (visit.kind) {
    case "SCHEDULED":
      return evaluateScheduled(visit) && check == null ? visit : null;
    case "FREQUENT":
      return evaluateFrequent(visit) ? visit : null;
    case "SPORADIC":
      return check == null;
    default:
  }
}

function evaluateScheduled(visit) {
  // TODO evaluate by Type of Day
  const now = moment().tz(visit.timezone);
  const visitDay = moment(visit.dayOfVisit);
  return visitDay.format("DD/MM/YYYY") === now.format("DD/MM/YYYY");
}

function evaluateFrequent(visit) {
  const { intervals } = visit;
  const now = moment().tz(visit.timezone);
  const day = now.day();
  const hour = now.hour() * 100 + now.minutes();
  return (
    intervals.filter(
      item => item.day == day && item.from <= hour && item.to >= hour
    ).length > 0
  );
}

async function findByResident(resident, timezone, kind, skip, limit) {
  let visits;
  if (kind == "FREQUENT") {
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
  } else if (kind == "SCHEDULED") {
    console.log(
      "FIND WITH",
      timezone,
      moment()
        .tz(timezone)
        .format("YYYY-MM-DD")
    );

    visits = await Visit.aggregate([
      {
        $match: {
          resident: mongoose.Types.ObjectId(resident),
          kind,
          dayOfVisit: {
            $gte: new Date(
              moment()
                .tz(timezone)
                .format("YYYY-MM-DD")
            )
          }
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
  } else {
    visits = await Visit.aggregate([
      {
        $match: {
          resident: mongoose.Types.ObjectId(resident),
          kind
        }
      },
      {
        $lookup: {
          from: "companies",
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
  const visitInstance = await Visit.findOne({ _id: visit, resident: user });
  if (!visitInstance)
    throw new ApiError("No posee autorizacion para realizar esta accion", 401);
  return await visitInstance.remove();
}

async function giveAccess(visitId, access, user) {
  const visit = await Visit.findOne({ _id: visitId, resident: user.id })
    .populate("guest")
    .populate("creator")
    .populate("resident")
    .populate("community");

  if (!visit)
    throw new ApiError("No posee autorizacion para realizar esta accion", 401);
  const push = await send(visit.creator.devices, "VISIT ACCESS", {
    visit,
    access
  });
  if (access) await check(visit.id, "IN");
  return { success: true };
}

module.exports = {
  create,
  update,
  check,
  destroy,
  guestIsScheduled,
  findByResident,
  giveAccess
};
