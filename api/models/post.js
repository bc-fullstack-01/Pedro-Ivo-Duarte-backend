const { Schema, model } = require('mongoose')
/**
 * @typedef Post
 * @property {string} _id
 * @property {string} title.required
 * @property {string} description.required - Post content
 * @property {Profile} profile.required - profile
 * @property {Array.<Comments>} comments - comments
 */
const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: 2
  },
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }]
})

module.exports = model('Post', postSchema)