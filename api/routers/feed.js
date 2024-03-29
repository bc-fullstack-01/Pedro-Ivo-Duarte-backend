const router = require('express').Router()
const { Post, Profile } = require('../models')

router
  .route('/')
  /**
   * This functions get posts feed
   * @route GET /feed?page={page}
   * @param {integer} page.query - current page
   * @group Feed - api
   * @returns {Array.<Posts>} 200 - An array of posts
   * @returns {Error} default - unexpected error
   * @security JWT
   */
  .get((req, res, next) => Promise.resolve()
    .then(() => Profile.findById(req.user.profile._id))
    .then((profile) => Post
      .find({ profile: { $in: [...profile.following, req.user.profile._id] } })
      .populate('profile')
      .limit(10)
      .skip((req.query.page || 0) * 10)
      .sort({ createdAt: 'desc' })
    )
    .then(data => res.status(200).json(data))
    .catch(err => next(err))
  )

module.exports = router