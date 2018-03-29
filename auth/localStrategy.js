const LocalStrategy = require("passport-local");
const { User } = require("../models");

module.exports = new LocalStrategy(
  {
    usernameField: "identification",
    passwordField: "password",
    session: false
  },
  authenticate
);

async function authenticate(identification, password, done) {
  let user = await User.findOne({ identification: identification });
  if (!user.password) return done(null, false);
  if (!user || !user.validPassword(password)) return done(null, false);
  return done(null, user);
}
