const { Strategy, ExtractJwt } = require("passport-jwt");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

async function authenticate(userInfo, next) {
  try {
    let user = await User.findById(userInfo.id);
    return next(null, user);
  } catch (e) {
    return next(new ApiError("User not found", 401), null);
  }
}

module.exports = new Strategy(
  {
    secretOrKey: "Mota Rules",
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
  },
  authenticate
);
