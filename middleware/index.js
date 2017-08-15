'use strict';

module.exports = {
  adminLevel: function (level) {
    return function (req, res, next) {
      if (req.user.admin && req.user.adminLevel <= level) {
        next();
      } else {
        res.redirect('/profile');
      }
    };
  },
  isAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      next();
    } else {
      req.session.destroy();
      res.redirect('/');
    }
  },
  isAdmin: function (req, res, next) {
    if (req.isAuthenticated()) {
      if (req.user.adminLevel > 0) {
        req.user.admin = true;
        req.user['adminLevel' + req.user.adminLevel] = true;
      } else {
        req.user.admin = false;
      }
      next();
    } else {
      res.redirect('/');
    }
  },
  liOrLocal: function (req) {
    let userReferrer = {};
    if (req.user.provider === 'linkedin') {
      // catches linkedin users after they first register
      userReferrer.linkedInId = req.user.linkedInId || req.user.id;
    } else {
      userReferrer.email = req.user.email;
    }
    req.user.liOrLocal = userReferrer;
  }
};
