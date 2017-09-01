'use strict';

const passport = require('passport');
const config = require('../config').config();

module.exports = {
  login: (req, res) => {
    res.render('login', { title: config.title + ' - Login', csrfToken: req.csrfToken() });
  },
  signup: function (req, res) {
    res.render('sign-up', { csrfToken: req.csrfToken() });
  },
  signin: function (req, res) {
    res.render('sign-in', { csrfToken: req.csrfToken() });
  },
  logout: function (req, res) {
    req.session.destroy(function (err) {
      if (err) {
        console.log(err);
      }
      res.redirect('/');
    });
  },
  localLogin: function (req, res, next) {
    passport.authenticate('local-signin', {
      successRedirect: '/profile',
      failureRedirect: '/login' },
      function (err, user, info) {
        if (err || !user) {
          return res.render('login', { title: config.title + ' - Login', errorMessage: info.message, formData: req.body, csrfToken: req.csrfToken() });
        }
        return req.logIn(user, function (err) {
          if (err) {
            return res.render('login', { title: config.title + ' - Login', errorMessage: info.message, formData: req.body, csrfToken: req.csrfToken() });
          }
          return res.redirect('/profile');
        });
      }
    )(req, res, next);
  },
  linkedInLogin: function (req, res, next) {
    passport.authenticate('linkedin', {
      successRedirect: '/profile',
      failureRedirect: '/login' },
      function (err, user, info) {
        if (err || !user) {
          return res.render('login', { title: config.title + ' - Login', errorMessage: info.message, formData: req.body, csrfToken: req.csrfToken() });
        }
        return req.logIn(user, function (err) {
          if (err) {
            return res.render('login', { title: config.title + ' - Login', errorMessage: info.message, formData: req.body, csrfToken: req.csrfToken() });
          }
          return res.redirect('/profile');
        });
      }
    )(req, res, next);
  }
};
