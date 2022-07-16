const { Schema, model } = require('mongoose')
/**
 * @typedef Post
 * @property {string} title.required
 * @property {string} description.required - Post content
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
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = model('Post', postSchema)