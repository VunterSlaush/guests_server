const { Community, CommunityUser, User } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");
const Webhook = require("./webhook");

async function create(community, userToAdd, reference, kind, user) {
  await findIfUserIsGranted(community, user);
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

    if (e.code === 11000)
      return await changeCommunityUserType(
        community,
        userToAdd,
        reference,
        kind
      );
    else throw new ApiError("Error en los datos ingresados", 400);
    console.log("{COMMUNITY_USER} Error Creating:", e);
  }
}

async function changeCommunityUserType(community, userToAdd, reference, kind) {
  const communityUser = await CommunityUser.findOne({
    community,
    user: userToAdd,
    reference
  });

  if (!communityUser) throw new ApiError("Error en los datos ingresados", 400);
  communityUser.kind = kind;
  await communityUser.save();
  return communityUser;
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
  // TODO TEST
  try {
    const user = await User.findOne({ _id: userToAdd });
    await Webhook.run(community, "ON_NEW_RESIDENT", user);
  } catch (error) {}
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
