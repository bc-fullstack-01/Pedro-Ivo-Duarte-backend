const createError = require('http-errors')
const { Comment, Post } = require('../models')

exports.beforeAllById = (req, res, next, id) => Promise.resolve()
  .then(() => {
    res.locals.post = { id }
    next()
  })
  .catch(err => next(err))

exports.list = (req, res, next) => Promise.resolve()
  .then(() => Comment.find({ post: res.locals.post.id }))
  .then((data) => {
    res.render('comments/list', {
      comments: data
    })
  })
  .catch(err => next(err))

exports.add = (req, res, next) => Promise.resolve()
  .then(() => new Comment(Object.assign(req.body.comment, { post: res.locals.post.id })).save())
  .then((comment) => Post.findById(comment.post)
    .then(post => Object.assign(post, { comments: [...post.comments, comment._id] }))
    .then(post => Post.findByIdAndUpdate(comment.post, post))
    .then(() => comment)
  )
  .then((data) => {
    res.message('add comment succes!')
    res.redirect(`/v1/posts/${res.locals.post.id}/comments/${data._id}`)
  })
  .catch(err => next(err))

exports.show = (req, res, next) => Promise.resolve()
  .then(() => Comment.findById(req.params.id))
  .then((data) => {
    if (data) {
      res.render('comments/show', {
        comment: data
      })
    } else {
      next(createError(404))
    }
  })
  .catch(err => next(err))

exports.save = (req, res, next) => Promise.resolve()
  .then(() => Comment.findByIdAndUpdate(req.params.id, req.body.comment, {
    runValidators: true
  }))
  .then(() => {
    res.message('save comment success!')
    res.redirect(`/v1/posts/${res.locals.post.id}/comments/${req.params.id}`)
  })
  .catch(err => next(err))

exports.delete = (req, res, next) => Promise.resolve()
  .then(() => Comment.deleteOne({ _id: req.params.id }))
  .then(() => {
    res.message('delete comment success!')
    res.redirect(`/v1/posts/${res.locals.post.id}`)
  })
  .catch(err => next(err))

exports.edit = (req, res, next) => Promise.resolve()
  .then(() => Comment.findById(req.params.id))
  .then((data) => {
    res.render('comments/edit', {
      comment: data
    })
  })
  .catch(err => next(err))
