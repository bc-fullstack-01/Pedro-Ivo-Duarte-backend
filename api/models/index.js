const mongoose = require('mongoose');

const connect = mongoose.connect(
  `${process.env.MONGODB || 'mongodb://localhost:27017/'}_${process.env.NODE_ENV || 'development'}`,
  { serverSelectionTimeoutMS: (!process.env.NODE_ENV ? 1000 : 5000) })
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
