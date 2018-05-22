const { Community, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");

async function create(community, userToAdd, kind, user) {
  try {
    await findIfUserIsGranted(community, user);
    let communityUser = new CommunityUser({ community, userToAdd, kind });
    await communityUser.save();
    return communityUser;
  } catch (e) {
    throw new ApiError("Error en los datos ingresados", 400);
  }
}

async function destroy(id, user) {
  let community = await CommunityUser.findOne({ _id: id, user: user._id });
  await findIfUserIsGranted(community.community, user);
  await community.remove();
  return true;
}

module.exports = {
  create,
  destroy
};
