const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = require('express').Router()
const { User, Profile } = require('../models')
const ACCESS_TOKEN_SECRET = 'black-magic'

router
  .route('/register')
  /**
   * This function creates a users
   * @route POST /security/register
   * @param {User.model} post.body.required - the new user
   * @group Security - api
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((hashedPass) => new User({ ...req.body, password: hashedPass }).save())
    .then((newUser) => new Profile({ name: req.body.name || req.body.user, user: newUser._id }).save()
      .then((profile) => User.findByIdAndUpdate(newUser._id, { profile })))
    .then((data) => res.status(201).json(data))
    .catch(err => next(err)))

router
  .route('/login')
  /**
   * This function handle the login
   * @route POST /security/login
   * @param {User.model} req.body.required - User credentials
   * @group Security - api
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then(user => user
      ? bcrypt.compare(req.body.password, user.password)
        .then((isValidated) => isValidated ? jwt.sign(JSON.stringify(user), ACCESS_TOKEN_SECRET) : next(createError(401)))
      : next(createError(404)))
    .then((accessToken) => res.status(201).json({ accessToken }))
    .catch(err => next(err)))

module.exports = router;