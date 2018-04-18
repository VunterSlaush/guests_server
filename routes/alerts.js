const alert = require("../controllers/alert");
const express = require("express");
const handler = require("../utils/ControllerHandler");
const router = express.Router();
const auth = require("../auth");
router.use(auth.jwt());

/**
 * @swagger
 * /alerts:
 *   post:
 *     description: create one new alert
 *     tags:
 *      - Alert
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           $ref: '#/definitions/Alert'
 *     responses:
 *       200:
 *         description: alert Created info
 *         schema:
 *             $ref: '#/definitions/Alert'
 */
router.post(
  "/",
  handler(alert.create, (req, res, next) => [req.body, req.user._id])
);

/**
 * @swagger
 * /alerts/{alert}:
 *   put:
 *     description: Update the description for a alert
 *     tags:
 *      - Alert
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             content:
 *               description: Post New description
 *               type: string
 *     responses:
 *       200:
 *         description: Post Updated
 *         schema:
 *             $ref: '#/definitions/Alert'
 */
router.put(
  "/:alert",
  handler(alert.update, (req, res, next) => [
    req.params.alert,
    req.body,
    req.user
  ])
);

/**
 * @swagger
 * /alerts/{alert}:
 *   delete:
 *     description: remove a selected Post, Only the User Owner can Delete it
 *     tags:
 *      - Alert
 *     parameters:
 *       - name: id
 *         description: id of alert to delete
 *         in:  path
 *         schema:
 *           		type: string
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: Deleted successful
 *       401:
 *         description: Unauthorized to do this action
 *       404:
 *         description: Post not found
 */
router.delete(
  "/:alert",
  handler(alert.destroy, (req, res, next) => [req.params.alert, req.user])
);

module.exports = router;
