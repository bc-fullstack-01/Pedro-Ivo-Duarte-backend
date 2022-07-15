const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')

const defaultOptions = require('./swagger.json')
const { Post, Comment } = require('./routers')
const { Connection } = require('./models')

const options = Object.assign(defaultOptions, { basedir: __dirname }) // app absolute path

// instanciate express
const app = express();
const expressSwagger = esg(app)
expressSwagger(options)

app.use(cors())
app.use(helmet())

// middlewares configuration

// encode url
app.use(express.urlencoded({ extended: true }));

// req.body parse to JSON 
app.use(express.json());

// set logger
app.use(logger(process.env.NODE_ENV || 'dev'));

app.use((req, res, next) => Connection
  .then(() => next())
  .catch(err => next(err))
)

// add all routes on a prefix version
Post.use('/', Comment)
app.use('/v1/posts', Post)

// catch all and 404 since no middleware responded
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  console.log(err)
  // mongoose validator?
  if (err.name && err.name === 'ValidationError') {
    console.log('req.body', req.body)
    res.status(406).json(err)
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).json({
      url: req.originalUrl,
      error: {
        message: "Not found"
      }
    })
  } else {
    // error page
    res.status(err.status || 500).json({
      url: req.originalUrl,
      error: err
    })
  }
});

module.exports = app;
