'use strict';

const express = require('express');

const app = express();
const path = require('path');

const port = process.env.PORT || 3000;
const favicon = require('serve-favicon');
const logger = require('./helpers/logger');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

// const scheduler = require('./services/scheduler');
// const DB = require('./models/db');
// const middleware = require('./middleware');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });

module.exports = app;

// scheduler.tasks();

// Helmet is an npm module used to protect headers - you get lots out of the box like content security policy)
app.use(helmet());
const ninetyDaysInMilliseconds = 7776000000;
app.use(helmet.hsts({ maxAge: ninetyDaysInMilliseconds, force: true }));
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }));
app.use(helmet.contentSecurityPolicy({
  // Specify directives as normal.
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'http://www.google-analytics.com/', 'http://ajax.googleapis.com/', 'https://platform.twitter.com/', 'http://platform.twitter.com/', 'https://syndication.twitter.com/timeline/', 'http://platform.linkedin.com/', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.2.25/angular.min.js', 'https://cdn.syndication.twimg.com/timeline/'],
    styleSrc: ["'self'", "'unsafe-inline'", 'https://maxcdn.bootstrapcdn.com/', 'http://platform.twitter.com/css/'],
    imgSrc: ["'self'", 'http://www.google-analytics.com/', "data:", 'https://syndication.twitter.com/', 'https://pbs.twimg.com/', 'https://o.twimg.com', 'https://ton.twimg.com/', 'http://platform.twitter.com/css/'],
    frameSrc: ['https://www.youtube.com', 'http://platform.linkedin.com/'],
    fontSrc: ["'self'", 'https://maxcdn.bootstrapcdn.com/'],
    objectSrc: [] // An empty array allows nothing through
  },
  reportOnly: false,
  setAllHeaders: true,
  disableAndroid: false,
  browserSniff: true
}));
app.use(helmet.noCache());
app.disable('view cache');

app.use(function (req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
});

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));

app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  store: new RedisStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'stillnotentirelysurehowthisworks',
  cookie: {
    maxAge: 28800000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV === "production") {
  app.all(/.*/, function (req, res, next) {
    let host = req.header("host");
    if (host.match(/^www\..*/i)) {
      next();
    } else {
      res.redirect(301, "http://www." + host);
    }
  });
}

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

app.use(function (req, res, next) {
  // res.locals.admin = middleware.isAdmin;
  next();
});

app.use(csrfProtection);

require('./routes/unauthorised.js')(app);
require('./routes/profile.js')(app);

app.use(function (err, req, res, next) {
  if (err.code !== 'EBADCSRFTOKEN') return next(err);

  // handle CSRF token errors here
  res.status(403);
  if (req.session) { req.session.destroy(); }
  return res.send('This form has been tampered with. Please <a href="www.mentormatch.org.uk/login">log in</a> again to perform this action.');
});

app.get('*', function (req, res) {
  res.status(404);
  logger.error('404 error. Page ' + req.url + ' not found. ');
  res.render('/404');
});

passport.serializeUser(function (user, done) {
  done(null, user);
});

// passport.deserializeUser(function (obj, done) {
//   if (obj.provider !== 'linkedin') {
//     DB.knex('mentors').where({ id: obj.id }).then(function (user) {
//       done(null, user[0]);
//     }).catch(function (err) {
//       console.log('error doing user action (local):', err);
//       return done(null, obj);
//     });
//   } else {
//     DB.knex('mentors').where({ linkedInId: obj.id }).then(function (data) {
//       if (data.length === 0) {
//         return done(null, false);
//       }
//       return done(null, data[0]);
//     }).catch(function (err) {
//       console.log('error doing user action (li):', err);
//       return done(null, obj);
//     });
//   }
// });

// error handling
app.use(function (err, req, res, next) {
  res.status(500);
  logger.error(err);
  res.redirect('/profile');
  next();
});

app.listen(port);
console.log('All kicking off on port ' + port);
