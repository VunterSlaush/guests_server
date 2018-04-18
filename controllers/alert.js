const { Alert, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { findIfUserIsGranted } = require("./utils");

// TODO SECURE THIS ROUTE!
async function create(info, author) {
  try {
    info.author = author;
    let alert = new Alert(info);
    await alert.save();
    return alert;
  } catch (e) {
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

module.exports = {
  create,
  update,
  destroy,
  userAlerts
};
