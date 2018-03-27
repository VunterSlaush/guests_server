const { Community, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");

// TODO SECURE THIS ROUTE!
async function create({ name, address }) {
  try {
    let community = new Community({ name, address });
    await community.save();
    return community;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function update(id, communityInfo, user) {
  await findIfUserIsGranted(id, user);
  let community = await Community.findOne({ _id: id });
  community.set(communityInfo);
  await community.save();
  return community;
}

async function find(query, skip, limit) {
  let communities = await Community.find({
    $or: [{ name: { $regex: query, $options: "i" } }]
  })
    .limit(limit)
    .skip(skip);
  return communities;
}

async function destroy(id, user) {
  await findIfUserIsGranted(id, user);
  let community = await Community.findOne({ _id: id });
  await community.remove();
  return true;
}

async function details(id, user) {
  let community = await Community.findOne({ _id: id });
  if (!community) throw new ApiError("Community Not Found", 404);
  return community;
}

async function userCommunities(user) {
  return await CommunityUser.find({ user: user });
}

async function people(communityId, skip, limit) {
  try {
    return await CommunityUser.find({ community: communityId });
  } catch (e) {
    throw new ApiError("Community not found", 404);
  }
}

module.exports = {
  create,
  update,
  find,
  destroy,
  details,
  userCommunities,
  people
};
