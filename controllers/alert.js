const { Alert, CommunityUser, User } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { findIfUserIsGranted } = require("./utils");
const OneSignal = require("../oneSignal");
// TODO SECURE THIS ROUTE!
async function create(info, author) {
  try {
    info.author = author;
    let alert = new Alert(info);
    await alert.save();
    await sendAlert(alert);
    return alert;
  } catch (e) {
    console.log("E", e);
    throw new ApiError("malformed request", 400);
  }
}

async function update(id, AlertInfo, user) {
  await findIfUserIsGranted(id, user);
  let alert = await Alert.findOne({ _id: id });
  alert.set(AlertInfo);
  await alert.save();
  return alert;
}

async function destroy(id, user) {
  await findIfUserIsGranted(id, user);
  let alert = await Alert.findOne({ _id: id });
  await alert.remove();
  return true;
}

async function userAlerts(user) {
  const communityUsers = await CommunityUser.find({ user });
  const communities = communityUsers.map(item => item.community);
  const alerts = await Alert.find({ community: { $in: communities } })
    .populate("community")
    .populate("author");
  return { alerts };
}

async function sendAlert(alert) {
  User.populate(alert, { path: "author" });
  const communityUsers = await CommunityUser.find({
    community: alert.community
  }).populate("user");
  const receivers = communityUsers
    .filter(item => item.user._id.toString() != alert.author._id.toString())
    .reduce((prev, act) => {
      return prev.concat(act.user.devices ? act.user.devices : []);
    }, []);
  await OneSignal.send(receivers, "alert", alert);
}

module.exports = {
  create,
  update,
  destroy,
  userAlerts
};
