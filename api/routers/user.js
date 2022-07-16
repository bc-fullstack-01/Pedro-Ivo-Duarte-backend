const createError = require('http-errors');
const express = require('express');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const router = express.Router()
const { User, Connection } = require('../models')
const ACCESS_TOKEN_SECRET = 'black-magic'

router
  .route('/')
  /**
   * This function list the users
   * @route Get /users
   * @groupd User - api
   * @returns {User} 200 - An array of users
   * @returns {Error} default - unexpected error
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => User.find({}))
    .then((data) => res.status(200).json(data))
    .catch(err => next(err)))
  /**
   * This function creates a users
   * @route POST /users
   * @param {User.model} post.body.required - the new user
   * @group User - api
   */
  .post((req, res, next) => Promise.resolve()
    .then(() => bcrypt.hash(req.body.password, 10))
    .then((hashedPass) => new User({ ...req.body, password: hashedPass }).save())
    .then((data) => res.status(201).json(data))
    .catch(err => next(err)))
/**
 * This function ,ake the login
 * @route POST /users/login
 * @param {User.model} req.body.required - User credentials
 */
router
  .route('/login')
  .post((req, res, next) => Promise.resolve()
    .then(() => User.findOne({ user: req.body.user }))
    .then(user => user ? bcrypt.compare(req.body.password, user.password) : next(createError(404)))
    .then(isValidated => isValidated ? jwt.sign(req.body.user, ACCESS_TOKEN_SECRET) : nexr(createError(401)))
    .then((accessToken) => res.status(201).json({ accessToken }))
    .catch(err => next(err)))


