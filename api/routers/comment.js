const express = require('express');
const { Post, Comment } = require('../models');
const router = express.Router();

router
  .param('postId', (req, res, next, id) => Promise.resolve()
    .then(() => {
      res.locals.post = { id }
      next()
    })
    .catch(err => next(err)))
  .route('/:postId/comments')
  /**
   * This function get all comments of a post
   * @route GET /posts/{postId}/comments
   * @param {string} postId.path.required - postId
   * @returns {Array<Comment>} 200 - An array of comments
   * @returns {Error} default - Unexpected error
   * @group Comment - api
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Comment.find({ post: res.locals.post.id }).populate('post'))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))
  /**
   * This function add a comment to a post
   * @route POST /posts/{postId}/comments
   * @param {string} postId.path.required
   * @param {Comment.model} comment.body.required
   * @group Comment - api
   * @security JWT
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => new Comment(Object.assign(req.body, { post: res.locals.post.id, user: req.user._id })).save())
    .then((comment) => Post.findById(comment.post)
      .then(post => Object.assign(post, { comments: [...post.comments, comment._id] }))
      .then(post => Post.findByIdAndUpdate(comment.post, post))
      .then(args => req.publish('comment', [args.profile], args))
      .then(() => comment)
    )
    .then((data) => res.status(201).json(data))
    .catch(err => next(err))
  )
router
  .route('/:postId/comments/:id')
  /**
   * @route GET /posts/{postId}/comments/{id}
   * @param {string} postId.path.required
   * @param {string} id.path.required
   * @group Comment - api
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))
  /**
   * @route PUT /posts/{postId}/comments/{id}
   * @param {Comment.model} comment.body.required
   * @param {string} postId.path.required
   * @param {string} id.path.required
   * @group Comment - api
   * @security JWT
   */
  .put((req, res, next) => Promise.resolve()
    .then(() => Comment.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))
  /**
   * this function deletes a comment by id
   * @route DELETE /posts/{postId}/comments/{id}
   * @param {string} postId.path.required - Post id
   * @param {string} id.path.required - Comment id
   * @group Comment - api
   * @security JWT
   */
  .delete((req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id))
    .then((comment) => Post.findByIdAndUpdate(comment.post, { $pull: { comments: comment._id } }))
    .then(() => Comment.findByIdAndDelete(req.params.id))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))

router
  .route('/:postId/comments/:id/like')
  /**
   * This function likes a comment
   * @route POST /posts/{postId}/comments/{id}/like
   * @param {string} postId.path.required - Post id
   * @param {string} id.path.required - Comment id
   * @group Comment - api
   * @security JWT
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => Comment.findOneAndUpdate({ _id: req.params.id }, { $push: { likes: req.user.profile._id } }))
    .then(args => req.publish('comment-like', [args.profile], args))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

module.exports = router