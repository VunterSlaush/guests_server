const community = require("../controllers/community");
const visit = require("../controllers/visit");
const communityUser = require("../controllers/communityUser");
const express = require("express");
const router = express.Router();
const handler = require("../utils/ControllerHandler");
const auth = require("../auth");
router.use(auth.jwt());

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

/**
 * @swagger
 * /communities/{community}/security:
 *   post:
 *     description: A;adir personal de Vigilancia
 *     tags:
 *      - Community
 *      - CommunityUser
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *       - name: body
 *         description: Comunidad
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               description: user id del usuario vigilante
 *               type: string
 *     responses:
 *       200:
 *         description: Comunidad Creada
 *         schema:
 *             $ref: '#/definitions/Community'
 */
router.post(
  "/:comunity/security",
  handler(communityUser.create, (req, res, next) => [
    req.params.comunity,
    req.body.user,
    "SECURITY",
    req.user
  ])
);

/**
 * @swagger
 * /communities/{community}/resident:
 *   post:
 *     description: A;adir residente o residentes
 *     tags:
 *      - Community
 *      - CommunityUser
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *       - name: body
 *         description: Comunidad
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               description: user id del usuario residente
 *               type: string
 *     responses:
 *       200:
 *         description: Comunidad Creada
 *         schema:
 *             $ref: '#/definitions/Community'
 */
router.post(
  "/:comunity/resident",
  handler(communityUser.create, (req, res, next) => [
    req.params.comunity,
    req.body.user,
    "RESIDENT",
    req.user
  ])
);

/**
 * @swagger
 * /communities/{community}/administrator:
 *   post:
 *     description: A;adir personal de administracion
 *     tags:
 *      - Community
 *      - CommunityUser
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *       - name: body
 *         description: Comunidad
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             user:
 *               description: user id del usuario vigilante
 *               type: string
 *     responses:
 *       200:
 *         description: Comunidad Creada
 *         schema:
 *             $ref: '#/definitions/Community'
 */
router.post(
  "/:comunity/administrator",
  handler(communityUser.create, (req, res, next) => [
    req.params.comunity,
    req.body.user,
    "ADMINISTRATOR",
    req.user
  ])
);

/**
 * @swagger
 * /communities/{comunityUser}:
 *   delete:
 *     description: remover administrador, residente, o personal de seguridad
 *     tags:
 *      - Community
 *      - CommunityUser
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *       - name: communityUser
 *         in:  path
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Registro Eliminado
 */
router.post(
  "/:comunityUser",
  handler(communityUser.destroy, (req, res, next) => [
    req.params.comunityUser,
    req.user
  ])
);

/**
 * @swagger
 * /communities/{community}/shouldEnter:
 *   post:
 *     description: El usuario tiene permiso para entrar?
 *     tags:
 *      - Visit
 *      - Community
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: community
 *         in:  path
 *         schema:
 *           type: string
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *             guest:
 *               type: string
 *     responses:
 *       200:
 *         description: Visita Eliminada
 */
router.post(
  "/:community/shouldEnter",
  handler(visit.guestIsScheduled, (req, res, next) => [
    req.params.community,
    req.body.identification,
    req.body.email,
    req.body.name,
    req.user
  ])
);

module.exports = router;
