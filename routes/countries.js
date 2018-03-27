const country = require("../controllers/country");
const express = require("express");
const handler = require("../utils/ControllerHandler");
const router = express.Router();
const auth = require("../auth");
router.use(auth.jwt());

/**
 * @swagger
 * /countries:
 *   get:
 *     description: get a list of countries
 *     tags:
 *      - Country
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: a list of all countries
 */
router.get("/", handler(country.getCountries, (req, res, next) => []));

/**
 * @swagger
 * /countries/{countryISO}/states:
 *   get:
 *     description: Update the description for a post
 *     tags:
 *      - Country
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: countryISO
 *         description: ISO of a country
 *         in:  path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: list of states for a country
 */
router.get(
	"/:countryISO/states",
	handler(country.getStates, (req, res, next) => [req.params.countryISO])
);

module.exports = router;
