const createError = require('http-errors')
const express = require('express');
const router = express.Router();
const upload = require('../lib/upload')

const { Post, Comment } = require('../models');

router
  .route('/')
  /**
   * This function get all posts
   * @route GET /posts
   * @return {Array.<Post>} 200 - An array posts
   * @return {Error} default - Unexpected error
   * @group Post - api
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.find({ profile: req.user.profile._id }).populate('comments').populate('profile'))
    .then((data) => {
      res.status(200).json(data)
    })
    .catch(err => next(err)))
  /**
   * This function add a new post
   * @route POST /posts
   * @param {Post.model} post.body.required -
   * @group Post - api
   * @security JWT
   */
  .post(upload.concat([(req, res, next) => Promise.resolve()
    .then(() => new Post({ ...req.body, profile: req.user.profile._id }).save())
    .then((args) => req.publish('post', req.user.profile.followers, args))
    .then((data) => res.status(201).json(data))
    .catch(err => next(err))]))

router
  .route('/:id')
  /**
   * This function get all comments of a post
   * @route GET /posts/{id}
   * @param {string} id.path.required - id
   * @group Post - api
   * @returns {<Post>} 200 - post
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({ path: 'comments', populate: { path: 'profile' } }).populate('profile'))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))
  /** 
  * This function edits a post
  * @route PUT /posts/{id}
  * @param {string} id.path.required - id
  * @param {Post.model} post.body.required - req.body
  * @group Post - api
  * @security JWT
  */
  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))
  /**
   * This function deletes a post
   * @route DELETE /posts/{id}
   * @param {string} id.path.required
   * @group Post - api
   * @security JWT
   */
  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndDelete(req.params.id))
    .then(() => (Comment.deleteMany({ post: req.params.id })))
    .then(() => res.status(203).json({ message: "Post deleted with success!" }))
    .catch(err => next(err))
  )
router
  .route('/:id/like')
  /**
    * This function deletes a post
    * @route POST /posts/{id}/like
    * @param {string} id.path.required
    * @group Post - api
    * @security JWT
    */
  .post((req, res, next) => Promise.resolve()
    .then(() => Post.findOneAndUpdate({ _id: req.params.id }, { $addToSet: { likes: req.user.profile._id } }))
    .then((args) => req.publish('post-like', [args.profile], args))
    .then((data) => data ? res.status(203).json(data) : next(createError(404)))
    .catch(err => next(err)))

router
  .route('/:id/unlike')
  /**
   * This function unlike a post
   * @route POST /posts/{id}/unlike
   * @param {string} id.path.required
   * @returns {Post} 203 - a Post
   * @group Post - api
   * @security JWT
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => Post.findOneAndUpdate({ _id: req.params.id }, { $pull: { likes: req.user.profile._id } }))
    .then(args => req.publish('post-unlike', [args.profile], args))
    .then(data => res.status(203).json(data))
    .catch(err => next(err)))

module.exports = router

