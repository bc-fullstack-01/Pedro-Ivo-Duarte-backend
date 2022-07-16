const { Schema, model } = require('mongoose');
/**
 * @typedef Comment
 * @property {string} _id
 * @property {string} description.required - Some description for product
 * @property {Post} post.required
 */
const commentSchema = new Schema ({
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
})

module.exports = model('Comment', commentSchema)