const { Post, User, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");

async function findIfUserIsGranted(communityId, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      communityId,
      kind: "ADMINISTRATOR"
    });
  } catch (e) {
    throw new ApiError("CommunityUser Not Found", 404);
  }
  if (!community) throw new ApiError("Unauthorized to do this action", 401);
  return community;
}

async function findIfUserIsOnCommunity(communityId, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      communityId
    });
  } catch (e) {
    throw new ApiError("CommunityUser Not Found", 404);
  }
  if (!community) throw new ApiError("Unauthorized to do this action", 401);
  return community;
}

async function findIfUserIsCommunitySecure(communityId, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      communityId,
      $or: [{ kind: "ADMINISTRATOR" }, { kind: "SECURITY" }]
    });
  } catch (e) {
    throw new ApiError("CommunityUser Not Found", 404);
  }
  if (!community) throw new ApiError("Unauthorized to do this action", 401);
  return community;
}

module.exports = {
  findIfUserIsGranted,
  findIfUserIsOnCommunity,
  findIfUserIsCommunitySecure
};
