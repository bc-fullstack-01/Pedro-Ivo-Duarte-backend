const mongoose = require('mongoose');

const connect = mongoose.connect('mongodb://locahost:27017/db');

mongoose.connection.on('error', (args) => {
  console.error(`${JSON.stringify(args)}`);
});
mongoose.connection.on('connected', (args) => {
  console.warn(` conneted ${JSON.stringify(args)}`)
});
mongoose.connection.on('disconnected', (args) => {
  console.error(`${JSON.stringify(args)}`)
});
exports.Connection = connect;
