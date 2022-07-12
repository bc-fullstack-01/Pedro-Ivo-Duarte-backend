const createError = require('http-errors')
const { Post, Connection } = require('../models')
module.exports = {
  beforeAll: (req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next()
    })
    .catch(err => next(err)),

  beforeById: (req, res, next) => Promise.resolve()
    .then(() => Connection.then())
    .then(() => {
      next()
    })
    .catch(err => next(err)),

  list: (req, res, next) => Promise.resolve()
    .then(() => Post.find({}))
    .then((data) => {
      res.render('posts/list', {
        posts: data
      })
    })
    .catch(err => next(err)),

  add: (req, res, next) => Promise.resolve()
    .then(() => new Post(req.body.post).save())
    .then((data) => {
      res.message('add post success')
      res.redirect(`/v1/posts/${data._id}`)
    })
    .catch(err => next(err)),

  show: (req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id).populate({
      path: 'comments'
    }))
    .then((data) => {
      if (data) {
        res.render('posts/show', {
          post: data
        })
      } else {
        next(createError(404))
      }
    })
    .catch(err => next(err)),

  save: (req, res, next) => Promise.resolve()
    .then(() => Post.findByIdAndUpdate(req.params.id, req.body.post, {
      runValidators: true
    }))
    .then(() => {
      res.message('save post success!')
      res.redirect(`/v1/posts/${req.params.id}`)
    })
    .catch(err => next(err)),

  delete: (req, res, next) => Promise.resolve()
    .then(() => Post.deleteOne({ _id: req.params.id }))
    .then(() => {
      res.message('delete post success!')
      res.redirect('/v1/posts')
    })
    .catch(err => next(err)),

  edit: (req, res, next) => Promise.resolve()
    .then(() => Post.findById(req.params.id))
    .then((data) => {
      res.render('posts/edit', {
        post: data
      })
    })
    .catch(err => next(err)),

  new: (req, res, next) => Promise.resolve()
    .then(() => {
      res.render('posts/new', { post: new Post(res.locals.post) })
    })
    .catch(err => next(err))
}