'use strict';

const emailController = require('../controllers/email');
const middleware = require('../middleware');
const csurf = require('csurf');

let csrfProtection = csurf({ cookie: true });

module.exports = function (app) {
  app.get('/inbox/', middleware.isAuthenticated, emailController.getInbox);
  app.get('/email/:id', middleware.isAuthenticated, csrfProtection, emailController.getEmail);
};
