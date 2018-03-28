const { Post, User, CommunityUser } = require("../models");

async function findIfUserIsGranted(community, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      community,
      kind: "ADMINISTRATOR"
    });
  } catch (e) {
    throw new ApiError("CommunityUser Not Found", 404);
  }
  if (!community) throw new ApiError("Unauthorized to do this action", 401);
  return community;
}

async function findIfUserIsOnCommunity(community, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      community
    });
  } catch (e) {
    throw new ApiError("CommunityUser Not Found", 404);
  }
  if (!community) throw new ApiError("Unauthorized to do this action", 401);
  return community;
}

module.exports = { findIfUserIsGranted, findIfUserIsOnCommunity };
