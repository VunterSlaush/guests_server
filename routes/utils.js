const express = require("express");
const router = express.Router();
const mseed = require("m-seeds");
const models = require("../models");
mseed.setModels(models);
/**
 * @swagger
 * /utils/seed:
 *   post:
 *     description: Seedear Data
 *     tags:
 *      - Utils
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             howMany:
 *               type: integer
 *     responses:
 *       200:
 *         description: Data Creada
 */
router.post("/seed", (req, res, next) => {
  const seedNumber = req.body.howMany;
  mseed.seedAll(req.body.howMany);
  res.json({ success: true });
});

module.exports = router;
