const { Community, CommunityUser, User, Visit } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { send } = require("../oneSignal");
const { findIfUserIsGranted, findIfUserIsCommunitySecure } = require("./utils");

// TODO SECURE THIS ROUTE!
async function create({ name, address }) {
  try {
    let community = new Community({ name, address });
    await community.save();
    return community;
  } catch (e) {
    throw new ApiError("Error en los datos ingresados", 400);
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
  const communitiesRaw = await Community.aggregate([
    {
      $lookup: {
        from: "communityusers",
        localField: "_id",
        foreignField: "community",
        as: "community_users"
      }
    },
    {
      $unwind: "$community_users"
    },
    {
      $match: {
        "community_users.user": mongoose.Types.ObjectId(user)
      }
    }
  ]);
  const communities = communitiesRaw.map(item => {
    return {
      name: item.name,
      _id: item._id,
      kind: item.community_users.kind
    };
  });
  return { communities };
}

async function securityCommunities(user) {
  const communitiesRaw = await Community.aggregate([
    {
      $lookup: {
        from: "communityusers",
        localField: "_id",
        foreignField: "community",
        as: "community_users"
      }
    },
    {
      $unwind: "$community_users"
    },
    {
      $match: {
        "community_users.user": mongoose.Types.ObjectId(user),
        "community_users.kind": "SECURITY"
      }
    }
  ]);
  const communities = communitiesRaw.map(item => {
    return {
      name: item.name,
      _id: item._id,
      kind: item.community_users.kind
    };
  });
  return { communities };
}

async function people(communityId, skip, limit) {
  try {
    return await CommunityUser.find({ community: communityId });
  } catch (e) {
    throw new ApiError("Comunidad no Encontrada", 404);
  }
}

async function requestAccess(
  communityId,
  { name, identification, residentIdentification, reference },
  files,
  user
) {
  await findIfUserIsCommunitySecure(communityId, user);
  const guest = await User.findOneOrCreate(
    { identification },
    { identification, name }
  );
  const communityUser = await findCommunityUserByIdOrReference(
    communityId,
    residentIdentification,
    reference
  );
  if (!communityUser) throw new ApiError("Residente no encontrado", 401);
  const resident = await User.findOne({ _id: communityUser.user });

  const visit = new Visit({
    community: communityId,
    resident: resident.id,
    guest: guest.id,
    kind: "NOT EXPECTED",
    creator: user.id,
    timezone: resident.timezone
  });
  await visit.save();
  const photos = await uploadFiles(files);
  await send(resident.devices, "UNEXPECTED VISIT", { visit });
  console.log(
    "GUEST",
    guest,
    "CU",
    communityUser,
    "R",
    resident,
    "Paths",
    photos
  );
  return true;
}

async function uploadFiles(files) {
  const paths = [];
  for (const key in files) {
    const path = await uploadFile("/storage", files[key]);
    paths.push(path);
  }
  return paths;
}

async function uploadFile(dir, file) {
  return new Promise((resolve, reject) => {
    file.mv(`${dir}/${file.name}`, err => {
      if (err) reject(err);
      resolve(`${dir}/${file.name}`);
    });
  });
}

async function findCommunityUserByIdOrReference(
  communityId,
  identification,
  reference
) {
  const resident = await User.findOne({
    identification
  });
  if (resident) {
    return await CommunityUser.findOne({
      community: communityId,
      user: resident.id
    });
  } else {
    return await CommunityUser.findOne({
      community: communityId,
      reference
    });
  }
}

module.exports = {
  create,
  update,
  find,
  destroy,
  details,
  userCommunities,
  securityCommunities,
  people,
  requestAccess
};
