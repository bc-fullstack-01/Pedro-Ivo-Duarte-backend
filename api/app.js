const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')
const jwt = require('jsonwebtoken')

const defaultOptions = require('./swagger.json')
const { Post, Comment, User: userRouter } = require('./routers')
const { Connection, User } = require('./models')

const options = Object.assign(defaultOptions, { basedir: __dirname }) // app absolute path
const ACCESS_TOKEN_SECRET = 'black-magic'

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

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return next(createError(401))
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next(createError(403))
    User.findOne({ user })
      .then((u => {
        req.user = u
        next()
      }))
  })

}

app.use((req, res, next) => Connection
  .then(() => next())
  .catch(err => next(err))
)

// add all routes on a prefix version
Post.use('/', authenticateToken, Comment)
app.use('/v1/posts', authenticateToken, Post)
app.use('/v1/users', userRouter)

// catch all and 404 since no middleware responded
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // mongoose validator?
  if (err.name && err.name === 'ValidationError') {
    res.status(406).json(err)
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).json({
      url: req.originalUrl,
      error: {
        message: "Not found"
      }
    })
  } else if (err.code === 11000) {
    res.status(500).json({
      url: req.originalUrl,
      error: {
        message: 'Duplicate key not allowed'
      }
    })
  } 
  else {
    // error page
    res.status(err.status || 500).json({
      url: req.originalUrl,
      error: err
    })
  }
});

module.exports = app;
