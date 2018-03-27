const community = require("../controllers/community");
const post = require("../controllers/post");
const express = require("express");
const router = express.Router();
const handler = require("../utils/ControllerHandler");
const auth = require("../auth");
router.use(auth.jwt());

/**
 * @swagger
 * /communities/{community}/posts:
 *   get:
 *     description: Notas de la comunidad, paginadas
 *     tags:
 *      - Community
 *      - Post
 *     produces:
 *      - application/json
 *     parameters:
 *       - $ref: "#/parameters/skip"
 *       - $ref: "#/parameters/limit"
 *     responses:
 *       200:
 *         description: Lista paginada de Notas
 *         type: array
 *         items:
 *            $ref: '#/definitions/Post'
 */
router.get(
  "/:community/posts",
  handler(post.get, (req, res, next) => [
    req.params.community,
    !req.query.skip ? 0 : Number(req.query.skip),
    !req.query.limit ? 30 : Number(req.query.limit)
  ])
);

/**
 * @swagger
 * /communities:
 *   post:
 *     description: Crear una Comunidad
 *     tags:
 *      - Community
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         description: Comunidad
 *         in:  body
 *         schema:
 *           $ref: '#/definitions/Community'
 *     responses:
 *       200:
 *         description: Comunidad Creada
 *         schema:
 *             $ref: '#/definitions/Community'
 */
router.post("/", handler(community.create, (req, res, next) => [req.body]));

/**
 * @swagger
 * /communities/{community}:
 *   put:
 *     description: Crear una Comunidad
 *     tags:
 *      - Community
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: body
 *         description: Comunidad
 *         in:  body
 *         schema:
 *           $ref: '#/definitions/Community'
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comunidad Creada
 *         schema:
 *             $ref: '#/definitions/Community'
 */
router.put(
  "/:community",
  handler(community.update, (req, res, next) => [
    req.params.community,
    req.body,
    req.user
  ])
);

/**
 * @swagger
 * /communities/{community}:
 *   delete:
 *     description: Eliminar una Comunidad
 *     tags:
 *      - Community
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comunidad Eliminada
 */
router.delete(
  "/:community",
  handler(community.destroy, (req, res, next) => [
    req.params.community,
    req.user
  ])
);

module.exports = router;
