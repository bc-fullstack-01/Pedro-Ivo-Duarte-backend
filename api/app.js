const createError = require('http-errors');
const express = require('express');
const logger = require('morgan');
const helmet = require('helmet')
const cors = require('cors')
const esg = require('express-swagger-generator')

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

function autheticateToken(req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token = null) return next(createError(401))
  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
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
Post.use('/', autheticateToken, Comment)
app.use('/v1/posts', autheticateToken, Post)
app.use('/v1/users', userRouter)

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
