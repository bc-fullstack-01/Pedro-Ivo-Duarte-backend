const mongoose = require('mongoose');

const connect = mongoose.connect(
  `${process.env.MONGO_URL || 'mongodb://localhost:27017/'}_${process.env.NODE_ENV || 'dev'}`,
  { serverSelectionTimeoutMS: (!process.env.NODE_ENV ? 3000 : 5000) })
  .catch(err => console.error(err));

exports.Post = require('./post');
exports.Comment = require('./comment')
exports.Profile = require('./profile')
exports.User = require('./user')

mongoose.connection.on('error', () => {
  console.error(`error while connnecting do MongoDB`);
});
mongoose.connection.on('connected', () => {
  console.warn(`connected to MongoDB`)
});
mongoose.connection.on('disconnected', () => {
  console.error(`disconnected from MongoDB`)
});

exports.Connection = connect;
