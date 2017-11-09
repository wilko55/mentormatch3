'use strict';

const profileController = require('../controllers/profile');
const middleware = require('../middleware');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });

module.exports = function (app) {
  app.get('/profile', middleware.isAuthenticated, profileController.getProfile);
  app.get('/edit-profile', middleware.isAuthenticated, csrfProtection, profileController.editProfile);
  app.post('/updateProfile', middleware.isAuthenticated, csrfProtection, profileController.updateProfile);
};
