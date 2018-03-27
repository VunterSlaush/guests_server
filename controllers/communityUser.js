const { Community, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");

// TODO ADD SOME PERMISIONS HANDLE HERE
async function create({ community, user, kind }) {
  try {
    await findIfUserIsGranted(community, user);
    let communityUser = new CommunityUser({ community, user, kind });
    await communityUser.save();
    return communityUser;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function destroy(id, user) {
  let community = await CommunityUser.findOne({ _id: id, user: user._id });
  await community.remove();
  return true;
}

module.exports = {
  create,
  destroy
};
