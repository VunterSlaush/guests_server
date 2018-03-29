const user = require("../controllers/user");
const post = require("../controllers/post");
const visit = require("../controllers/visit");
const express = require("express");
const router = express.Router();
const secureRouter = express.Router();
const handler = require("../utils/ControllerHandler");
const auth = require("../auth");

// THIS IS A MODEL, YOU CAN REFERENCE THIS AS IN LINE: 54 or 86

/**
 * @swagger
 * /user/auth:
 *   post:
 *     description: authenticate the user via all SNS on the App
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
 *             identification:
 *               description: CEDULA
 *               type: string
 *             password:
 *               description: user password, used to authenticate via local authentication, only require when authenticate via local
 *               type: string
 *     responses:
 *       200:
 *         description: user information and authorization token
 *         schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              user:
 *                $ref: '#/definitions/User'
 *			 401:
 *         description: Unauthorized user, it means that the credentials passed are not valid
 */
router.all(
  "/auth",
  auth.identifyAuthProvider,
  handler(user.auth, (req, res, next) => [req.user])
);

/**
 * @swagger
 * /user:
 *   post:
 *     description: sign up user via local
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     security: []
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         schema:
 *           $ref: '#/definitions/User'
 *     responses:
 *       200:
 *         description: user information
 *         schema:
 *             $ref: '#/definitions/User'
 *       400:
 *         description: invalid parameters are passed
 */
router.post("/", handler(user.create, (req, res, next) => [req.body]));

secureRouter.use(auth.jwt());

/**
 * @swagger
 * /user/me:
 *   put:
 *     description: User Update Profile, all parameters are optional
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: user
 *         description: User object
 *         in:  body
 *         schema:
 *           $ref: '#/definitions/User'
 *       - in: formData
 *         name: resumeFile
 *         type: file
 *         description: the resume file to upload
 *       - in: formData
 *         name: profileImageFile
 *         type: file
 *         description: the profile Image
 *       - in: formData
 *         name: profileCoverFile
 *         type: file
 *         description: the profile Cover image
 *     responses:
 *       200:
 *         description: user information updated
 *         schema:
 *             $ref: '#/definitions/User'
 */
secureRouter.put(
  "/me",
  handler(user.update, (req, res, next) => [req.user.id, req.body, req.files])
);

/**
 * @swagger
 * /user/me/visits:
 *   get:
 *     description: Lista de visitas
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     parameters:
 *       - $ref: "#/parameters/skip"
 *       - $ref: "#/parameters/limit"
 *     responses:
 *       200:
 *         description: user information updated
 *         schema:
 *             $ref: '#/definitions/User'
 */
secureRouter.put(
  "/me/visits",
  handler(visit.findByResident, (req, res, next) => [
    req.user.id,
    !req.query.skip ? 0 : Number(req.query.skip),
    !req.query.limit ? 30 : Number(req.query.limit)
  ])
);

/**
 * @swagger
 * /user/me:
 *   get:
 *     description: get the User Profile of an authenticate user
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     responses:
 *       200:
 *         description: user information updated
 *         schema:
 *             $ref: '#/definitions/User'
 */
secureRouter.get(
  "/me",
  handler(user.profile, (req, res, next) => [req.user.id])
);

/**
 * @swagger
 * /user/{user}:
 *   get:
 *     description: get the User public profile by `userId`
 *     tags:
 *      - User
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: user
 *         description: the user profile owner
 *         in:  path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: user information updated
 *         schema:
 *             $ref: '#/definitions/User'
 */
secureRouter.get(
  "/:user",
  handler(user.publicProfile, (req, res, next) => [req.params.user])
);

router.use(secureRouter);
module.exports = router;
