const { User } = require("../models");
const { generateAuthToken } = require("../auth/utils");
const ApiError = require("../utils/ApiError");

async function auth(user) {
  if (user) {
    var token = generateAuthToken(user);
    return { token: token, user: user };
  }
  throw new ApiError("user not found", 404);
}

async function create(info) {
  try {
    let user = new User(info);
    await user.save();
    return auth(user);
  } catch (e) {
    if (e.code && e.code == 11000)
      throw new ApiError("the Identification is repeated", 409);
    throw new ApiError("invalid parameters", 400);
  }
}

async function profile(id) {
  let user = await User.findOne({ _id: id }).lean();
  return user;
}

async function update(id, user, files) {
  let userUpdated = await User.findOneAndUpdate(
    { _id: id },
    { $set: user },
    {
      runSettersOnQuery: true,
      new: true
    }
  );
  return { user: userUpdated };
}

module.exports = { auth, create, update, profile };
