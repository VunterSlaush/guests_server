const { Post, User, CommunityUser } = require("../models");
const ApiError = require("../utils/ApiError");
const { findIfUserIsGranted } = require("./utils");

async function uploadFiles(files, id) {
  let arry = [];
  for (k in files) {
    let url = await upload(
      files[k],
      `posts/${id}/${arry.length}.${files[k].name.split(".").pop()}`
    );
    arry.push(url);
  }
  return arry;
}

async function create({ community, content, user }) {
  try {
    await findIfUserIsGranted(community, user);
    let post = new Post({ community, content });
    /*if (files) { // TODO if is needed ..
      let images = await uploadFiles(files, post.id);
      post.images = images;
    }*/
    await post.save();
    return post;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function get(community, skip, limit) {
  return Post.find({ community })
    .skip(skip)
    .limit(limit);
}

async function update(id, content, user) {
  await findIfUserIsGranted(id, user);
  let post = await Post.findOne({ _id: id });
  try {
    post.content = content;
    await post.save();
    return post;
  } catch (e) {
    throw new ApiError("malformed request", 400);
  }
}

async function destroy(id, community, user) {
  await findIfUserIsGranted(community, user);
  let post = await Post.findOne({ _id: id });
  await post.remove();
  return true;
}

module.exports = { create, update, destroy };
