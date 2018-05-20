const company = require("../controllers/company");
const express = require("express");
const router = express.Router();
const handler = require("../utils/ControllerHandler");
const auth = require("../auth");

router.use(auth.jwt());
/**
 * @swagger
 * /companies:
 *   get:
 *     description: get the Companies
 *     tags:
 *      - Commpany
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: user information updated
 *         schema:
 *             $ref: '#/definitions/Company'
 */
router.get("/", handler(company.find, (req, res, next) => [req.query.query]));
module.exports = router;
