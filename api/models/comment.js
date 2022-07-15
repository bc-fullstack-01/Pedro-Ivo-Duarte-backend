const { Schema, model } = require('mongoose');
/**
 * @typedef Comment
 * @property {string} description.required - Some description for product
 */
const commentSchema = new Schema ({
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
})

module.exports = model('Comment', commentSchema)