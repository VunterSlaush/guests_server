const post = require("../controllers/post");
const express = require("express");
const handler = require("../utils/ControllerHandler");
const router = express.Router();
const auth = require("../auth");
router.use(auth.jwt());

/**
 * @swagger
 * /posts:
 *   post:
 *     description: create one new Post
 *     tags:
 *      - Post
 *     produces:
 *      - application/json
 *     parameters:
 *       - name: body
 *         in:  body
 *         schema:
 *           type: object
 *           properties:
 *            content:
 *              description: the text write by the user for the post
 *              type: string
 *            images:
 *              description: a list of files
 *              type: array
 *              items:
 *                type: string
 *                format: binary
 *     responses:
 *       200:
 *         description: Post Created info
 *         schema:
 *             $ref: '#/definitions/Post'
 */
router.post("/", handler(post.create, (req, res, next) => [req.body]));

/**
 * @swagger
 * /posts/{post}:
 *   put:
 *     description: Update the description for a post
 *     tags:
 *      - Post
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
 *             $ref: '#/definitions/Post'
 */
router.put(
  "/:post",
  handler(post.update, (req, res, next) => [
    req.params.post,
    req.body.content,
    req.user
  ])
);

/**
 * @swagger
 * /posts/{post}:
 *   delete:
 *     description: remove a selected Post, Only the User Owner can Delete it
 *     tags:
 *      - Post
 *     parameters:
 *       - name: id
 *         description: id of post to delete
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
  "/:post",
  handler(post.destroy, (req, res, next) => [req.params.post, req.user])
);

module.exports = router;
