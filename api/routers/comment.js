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
  .get((req, res, next) => Promise.resolve()
    .then(() => Comment.find({ post: res.locals.post.id }.populate('post')))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))

  .post((req, res, next) => Promise.resolve()
    .then(() => new Comment(Object.assign(req.body.comment, { post: res.locals.post.id })).save())
    .then((comment) => Post.findById(comment.post)
      .then(post => Object.assign(post, { comments: [...post.comments, comment._id] }))
      .then(post => Post.findByIdAndUpdate(comment.post, post))
      .then(() => comment)
    )
    .then((data) => res.status(201).json(data))
    .catch(err => next(err))
  )
router
  .route('/:postId/comments/:id')
  .get((req, res, next) => Promise()
    .then(() => Comment.findById(req.params.id))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))

  .put((req, res, next) => Promise()
    .then(() => Comment.findByIdAndUpdate(req.params.id, req.body, { runValidators: true }))
    .then((data) => res.status(203).json(data))
    .catch(err => next(err)))

  .delete((req, res, next) => Promise.resolve()
    .then(() => Comment.findById(req.params.id))
    .then((comment) => Post.findByIdAndUpdate(comment.post), { $pull: { comments: data.id } })
    .then(() => Comment.findByIdAndDelete(req.params.id))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))

module.exports = router