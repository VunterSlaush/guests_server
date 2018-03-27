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
	for (str in strategies) {
		passport.use(strategies[str]);
	}
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	return passport.initialize();
}

function identifyAuthProvider(req, res, next) {
	let strategyName = "local";
	if (req.body.facebook) {
		req.body.access_token = req.body.facebook;
		strategyName = "facebook-token";
	} else if (req.body.google) {
		req.body.access_token = req.body.google;
		strategyName = "google-plus-token";
	} else if (req.query.code && req.query.state) {
		strategyName = "linkedin";
	}

	return passport.authenticate(
		strategyName,
		{ session: false },
		(err, data) => {
			if (err || !data) return res.status(401).send("Unauthorized");
			req.user = data;
			if (req.user.redirect) res.redirect(req.user.redirect);
			else next();
		}
	)(req, res, next);
}

module.exports = {
	init,
	passport,
	utils,
	identifyAuthProvider,
	jwt: () => passport.authenticate("jwt", { session: false })
};
