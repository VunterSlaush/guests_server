const ApiError = require("../utils/ApiError");
const country = require("countryjs");

async function getCountries() {
	return country
		.all()
		.filter(doc => doc.name && doc.ISO)
		.map(doc => ({ name: doc.name, iso: doc.ISO.alpha2 }));
}

async function getStates(countryISO) {
	return country.states(countryISO);
}

module.exports = { getCountries, getStates };
