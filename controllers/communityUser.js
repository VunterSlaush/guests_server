const { Community, CommunityUser, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");
const Webhook = require("./webhook");

async function create(community, userToAdd, reference, kind, user) {
  // await findIfUserIsGranted(community, user);
  try {
    let communityUser = new CommunityUser({
      community,
      user: userToAdd,
      kind,
      reference,
      status: "APPROVED"
    });
    await communityUser.save();
    if (kind === "RESIDENT") await runOnUserWebhook(community, userToAdd);
    return communityUser;
  } catch (e) {
    console.log("EEE", e);
    throw new ApiError("Error en los datos ingresados", 400);
  }
}

async function join(community, user, reference) {
  try {
    let communityUser = new CommunityUser({
      community,
      user,
      kind: "RESIDENT",
      reference,
      status: "PENDING"
    });
    await communityUser.save();
    await runOnUserWebhook(community, user);
    return communityUser;
  } catch (e) {
    console.log("E", e);
    if (e.status == 401) throw e;
    throw new ApiError("Error en los datos ingresados", 400);
  }
}

async function runOnUserWebhook(community, userToAdd) {
  const user = await User.findOne({ _id: userToAdd });
  await Webhook.run(community, "ON_NEW_RESIDENT", user);
}

async function destroy(id, user) {
  let community = await CommunityUser.findOne({ _id: id });
  await findIfUserIsGranted(community.community, user);
  await community.remove();
  return true;
}

module.exports = {
  create,
  destroy,
  join
};
