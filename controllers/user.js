const { User } = require("../models");
const { simpleMail } = require("../mailer");
const { generateAuthToken } = require("../auth/utils");
const ApiError = require("../utils/ApiError");
const mkdirp = require("mkdirp");

async function auth(user) {
  if (user) {
    var token = generateAuthToken(user);
    return { token: token, user: user };
  }
  throw new ApiError("user not found", 404);
}

async function create(info, image) {
  try {
    let user = new User(info);
    if (image) {
      let imageUrl = await uploadImage(user, image);
      user.image = imageUrl;
    }
    await user.save();
    return auth(user);
  } catch (e) {
    if (e.code && e.code == 11000)
      throw new ApiError("the Identification or email is repeated", 409);
    throw new ApiError("invalid parameters", 400);
  }
}

async function addDevice(device, user) {
  return User.findOneAndUpdate({ _id: user }, { $push: { devices: device } });
}

async function removeDevice(device, user) {
  return User.findOneAndUpdate({ _id: user }, { $pull: { devices: device } });
}

async function uploadImage(user, image) {
  return new Promise((resolve, reject) => {
    mkdirp(`storage/users/${user._id}`, err => {
      if (err) return reject();
      image.mv(`storage/users/${user._id}/${image.name}`, err => {
        if (err) reject(err);
        resolve(`storage/users/${user._id}/${image.name}`);
      });
    });
  });
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

async function forgotPassword(email) {
  const user = await User.findOne({ email: email });
  console.log("USER GETTED", user);
  if (!user) throw new ApiError("user not found", 404);

  const code = Math.floor(Math.random() * Math.pow(10, 6));
  user.code = code; // TODO Encrypt this!

  await user.save();
  const success = await simpleMail(
    `Aqui esta tu codigo: ${code}`,
    "Codigo de Cambio de Contraseña",
    user.email
  );
  return { success };
}

async function verifyCode(email, code) {
  console.log("US ", email, code);
  const user = await User.findOne({ email, code });
  if (!user) throw new ApiError("user not found", 404);
  return { success: true };
}

async function changePassword(email, code, password) {
  const user = await User.findOne({ email, code });
  if (!user) throw new ApiError("user not found", 404);
  user.set("password", password);
  await user.save();
  return { success: true };
}

module.exports = {
  auth,
  create,
  update,
  profile,
  addDevice,
  removeDevice,
  forgotPassword,
  verifyCode,
  changePassword
};
