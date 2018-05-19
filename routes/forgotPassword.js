const user = require("../controllers/user");
const express = require("express");
const router = express.Router();
const handler = require("../utils/ControllerHandler");

/**
 * @swagger
 * /forgotPassword:
 *   post:
 *     description: send forgot password code to the email
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     security: []
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *     responses:
 *       200:
 *         description: the emails is sended
 */
router.post(
  "/",
  user.forgotPassword,
  handler(user.forgotPassword, (req, res, next) => [req.body.email])
);

/**
 * @swagger
 * /forgotPassword/code:
 *   post:
 *     description: verify the code
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     security: []
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             code:
 *               type: integer
 *     responses:
 *       200:
 *         description: the code is valid
 */
router.post(
  "/code",
  handler(user.verifyCode, (req, res, next) => [req.body.email, req.body.code])
);

/**
 * @swagger
 * /forgotPassword/changePassword:
 *   post:
 *     description: change the user password by verification and email code!
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     security: []
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             code:
 *               type: integer
 *     responses:
 *       200:
 *         description: the password is changed!
 */
router.post(
  "/changePassword",
  handler(user.changePassword, (req, res, next) => [
    req.body.email,
    req.body.code,
    req.body.password
  ])
);

module.exports = router;
