'use strict';

const profileController = require('../controllers/profile');
const middleware = require('../middleware');

module.exports = function (app) {
  app.get('/profile', middleware.isAuthenticated, profileController.getProfile);
};
