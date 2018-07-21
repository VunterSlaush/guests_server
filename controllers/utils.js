const { Post, User, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");

async function findIfUserIsGranted(communityId, user) {
  console.log("+ PARAMS", communityId, user);
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      community: communityId,
      kind: "ADMINISTRATOR"
    });
  } catch (e) {
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      404
    );
  }
  if (!community)
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      401
    );
  return community;
}

async function findIfUserIsOnCommunity(communityId, user) {
  let community;
  try {
    community = await CommunityUser.findOne({
      user,
      community: communityId
    });
  } catch (e) {
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      404
    );
  }
  if (!community)
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      401
    );
  return community;
}

async function findIfUserIsCommunitySecure(community, user) {
  let communityFound;
  try {
    communityFound = await CommunityUser.findOne({
      user,
      community,
      $or: [{ kind: "ADMINISTRATOR" }, { kind: "SECURITY" }]
    });
  } catch (e) {
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      404
    );
  }
  if (!community)
    throw new ApiError(
      "No tiene los privilegios para realizar esta accion",
      401
    );
  return communityFound;
}

module.exports = {
  findIfUserIsGranted,
  findIfUserIsOnCommunity,
  findIfUserIsCommunitySecure
};
