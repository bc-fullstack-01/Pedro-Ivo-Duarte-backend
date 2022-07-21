const { Schema, model } = require('mongoose');
/**
 * @typedef Comment
 * @property {string} _id
 * @property {string} description.required - Some description for product
 * @property {Profile} profile.required
 * @property {Post} post.required
 */
const commentSchema = new Schema ({
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  },
  post: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Post'
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }]
})

module.exports = model('Comment', commentSchema)