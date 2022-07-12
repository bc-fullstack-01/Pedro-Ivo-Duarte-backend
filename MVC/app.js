const path = require('path');

const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const logger = require('morgan');
const createError = require('http-errors');

const routes = require('./routers');

// instaciate express
const app = express();

// configuring express
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// define a curstom res.message() method
// which stores messages in the session
app.response.message = function (msg) {
  // reference 'req.session' via the 'this.req' reference
  const sess = this.req.session
  // simply add the msg to an array for later
  sess.messages = sess.messages || []
  sess.messages.push(msg)
  return this
}

// middlewares configuration
// encode url
app.use(express.urlencoded({ extended: true }));
// req.body parse to JSON 
app.use(express.json());
// allow ovverriding method in query (?_methodput)
app.use(methodOverride('_method'))
// assets images css ...
app.use(express.static(path.join(__dirname, 'public')));
// session suport
app.use(session({
  resave: false, // don't save session with unmodified
  saveUninitialized: false, // dont't create session until something
  secret: 'some secret here'
}))

// take errors from session and clean
app.use(function (req, res, next) {
  // exposes "error" local variable
  res.locals = Object.assign(res.locals, req.session.form)
  res.locals.errors = Object.assign([], res.locals, req.session.errors)
  res.locals.messages = Object.assign([], res.locals, req.session.messages)
  next()
  // empty or "flush" the error so they
  // don't build up
  req.session.errors = []
  req.session.messages = []
  req.session.form = {}
})
// set logger
app.use(logger(process.env.NODE_ENV || 'dev'));

// add all routes on a prefix version
app.get('/', (req, res) => res.redirect('/v1/posts')) // redirect home
app.use('/v1', routes)

// catch all and 404 since no middleware responded
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  // mongoose validator?
  if (err.name && err.name === 'ValidationError') {
    // retrive last view
    const lastView = req.headers.referer.replace(`${req.headers.origin}/`, '/')
    // save form
    req.session.form = req.body
    // save errors
    req.session.errors = Object.entries(err).map(([, obj]) => obj)
    req.session.messages.push(err.message)

    res.redirect(lastView)
  } else if ((err.status && err.status === 404) || (err.name && err.name === 'CastError')) {
    res.status(404).render('404', {
      url: req.originalUrl
    })
  } else {
    // error page
    res.status(err.status || 500).render('5xx', { err })
  }
});

module.exports = app;
