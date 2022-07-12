const { Schema, model } = require('moongose');

const commentSchema = {
  description: {
    type: String,
    required: true,
    minLength: 2
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post'
  }
}

module.exports = model('Comment', commentSchema)