const {Schema, model} = require('mongoose')
/**
 * @typedef Profile
 * @property {string} name.required
 * @property {User} user.required - user
 * @property {Array.<User>} following - following profiles
 */
const profileSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2
  },
  user: {
    required: true,
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }],
  followers: [{
    type: Schema.Types.ObjectId,
    ref: 'Profile'
  }]
}, { timestamps: true })
profileSchema.index({name: 'text'})
module.exports = model('Profile', profileSchema)