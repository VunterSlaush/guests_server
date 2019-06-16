const passport = require("passport");
const utils = require("./utils");

const strategies = require("require-all")({
  dirname: __dirname,
  filter: filename => {
    if (filename.includes("Strategy")) return filename;
    return;
  }
});

function init() {
  for (str in strategies)
    passport.use(str.replace("Strategy.js", ""), strategies[str]);

  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => done(null, user));

  return passport.initialize();
}

function user(req, res, next) {
  return passport.authenticate("local", { session: false }, (err, data) => {
    if (err || !data) return res.status(401).send({ status: 401, message: "Usuario no encontrado" });
    req.user = data;
    if (req.user.redirect) res.redirect(req.user.redirect);
    else next();
  })(req, res, next);
}

function security(req, res, next) {
  return passport.authenticate("security", { session: false }, (err, data) => {
    if (err || !data) return res.status(401).send({ status: 401, message: "Usuario no encontrado" });
    req.user = data;
    if (req.user.redirect) res.redirect(req.user.redirect);
    else next();
  })(req, res, next);
}

module.exports = {
  init,
  passport,
  utils,
  user,
  security,
  jwt: () => passport.authenticate("jwt", { session: false })
};
