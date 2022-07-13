const express = require('express');
const { Post, Comment } = require('../models');
const router = express.Router();

router
  .route('/')
  .get((req, res, next) => Promise.resolve()
    .then(() => {
      console.log('rodou')
      Post.find({}).populate('comments')
      })
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))

  .post((req, res, next) => Promise.resolve()
    .then(() => new Post(req.body.post).save())
    .then((data) => res.status(201).json(data))
    .catch(err => next(err)))

router
  .route('/:id')
  .get((req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({ path: 'comments' }))
    .then((data) => data ? res.status(200).res.json(data) : next(createError(404)))
    .catch(err => next(err)))

  .put((req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body.post, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

  .delete((req, res, next) => Promise.resolve()
    .then(() => Post.deleteOne({ _id: req.params.id }))
    .then(() => (Comment.deleteMany({post: req.params.id})))
    .catch(err => next(err))
  )

  module.exports = router
