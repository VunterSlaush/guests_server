const { Community, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { findIfUserIsGranted } = require("./utils");

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

module.exports = {
  create,
  update,
  find,
  destroy,
  details,
  userCommunities,
  people
};
