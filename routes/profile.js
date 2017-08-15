'use strict';

const profileController = require('../controllers/profile');

module.exports = function (app) {
  app.get('/profile', profileController.getProfile);
};
