const { Schema, model } = require('mongoose')
/**
 * @typedef Post
 * @property {string} _id
 * @property {string} title.required
 * @property {string} description.required - Some description for product
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
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
})

module.exports = model('Post', postSchema)