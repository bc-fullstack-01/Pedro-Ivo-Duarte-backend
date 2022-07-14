const express = require('express');
const { Post, Comment } = require('../models');
const router = express.Router();
const createError = require('http-errors')

router
  .route('/')
  /**
   * This function comment is parsed by doctrine
   * @route GET /posts
   * @group Post - api
   * @return {Post} 200 - An array of user info
   * @return {Error} default - Unexpected error
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.find({}).populate('comments'))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))
  /**
   * This function comment is parsed by doctrine
   * @route POST /posts
   * @param {Post.model} post.body.required - the new point
   * @group Post - api
   * @param {string} title.query.required - Post title
   * @param {string} description.query.required - description
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => new Post(req.body).save())
    .then((data) => res.status(201).json(data))
    .catch(err => next(err)))

router
  .route('/:id')
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({ path: 'comments' }))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))

  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndDelete(req.params.id))
    .then(() => (Comment.deleteMany({ post: req.params.id })))
    .then(() => res.status(200).send({ message: "Post deleted with success!" }))
    .catch(err => next(err))
  )

module.exports = router
