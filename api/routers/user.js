const createError = require('http-errors');
const express = require('express');
const router = express.Router()
const { User } = require('../models')

router
  .route('/me')
  /**
   * This function return my user
   * @route Get /users/me
   * @group User - api
   * @returns {User} 200 - my user
   * @returns {Error} default - unexpected error
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => User.findById(req.user._id))
    .then((data) => data ? res.status(200).json(data) : next(createError(404)))
    .catch(err => next(err)))
  /**
   * This Function update my user
   * @route PUT /users/me
   * @group User - api
   * @param {User.model} user.body.required -
   * @returns {User} 203 - my user
   * @returns {Error} default - Unexpected error
   * @security JWT
   */
  .put((req, res, next) => Promise.resolve()
    .then(() => User.findByIdAndUpdate(req.user._id, req.body, { runValidators: true }))
    .then(data => res.status(203).json(data))
    .catch(err => next(err)))
  /**
   * This Function delete my user
   * @route DELETE /users/me
   * @group User - api
   * @returns {User} 203 - my user
   * @returns {Error} default - Unexpected error
   * @security JWT
   */
  .delete((req, res, next) => Promise.resolve()
    .then(() => User.deleteOne({ _id: req.user._id }))
    .then(data => res.status(203).json(data))
    .catch(err => next(err)))



module.exports = router;


