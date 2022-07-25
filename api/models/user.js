const { model, Schema } = require('mongoose');
/**
 * @typedef User
 * @property {string} _id
 * @property {string} user.required
 * @property {string} password.required
 * @property {Profile} profile - user profile
 */
const userSchema = new Schema({
  user: {
    type: String,
    unique: true,
    required: true,
    minLength: 2
  },
  password: {
    type: String,
    required: true,
    minLength: 2
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }
})

module.exports = model('User', userSchema)