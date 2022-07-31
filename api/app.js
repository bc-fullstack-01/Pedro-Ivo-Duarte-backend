const path = require('path')
const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')
const jwt = require('jsonwebtoken')

const defaultOptions = require('./swagger.json')
const { Post, Comment, User: userRouter, Security, Profile, Feed } = require('./routers')
const { Connection, User } = require('./models')
const pubsub = require('./lib/pubsub')

const options = Object.assign(defaultOptions, { basedir: __dirname }) // app absolute path
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'black-magic'

// instanciate express
const app = express();
const expressSwagger = esg(app)
expressSwagger(options)

app.use(cors())
// app.use(helmet())

// middlewares configuration

// encode url
const urlencodedMiddleware = express.urlencoded({ extended: true })
app.use((req, res, next) => (/^multipart\//i.test(req.get('Content-Type'))) ? next() : urlencodedMiddleware(req, res, next))
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
    User.findOne(user).populate('profile')
      .then((u => {
        req.user = u
        next()
      }))
      .catch(err => next(err))

  })

}

app.use((req, res, next) => Connection
  .then(() => next())
  .catch(err => next(err))
)

app.use(express.static(path.join(__dirname, 'public')))

app.use(pubsub.pub)

// add all routes on a prefix version
Post.use('/', authenticateToken, Comment)
app.use('/v1/posts', authenticateToken, Post)
app.use('/v1/users', authenticateToken, userRouter)
app.use('/v1/profiles', authenticateToken, Profile)
app.use('/v1/feed', authenticateToken, Feed)
app.use('/v1/security', Security)

app.get('/v1/seed', (req, res) => {
  require('./seed')
  res.status(200).end()
})

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
