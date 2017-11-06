'use strict';

const matchesController = require('../controllers/matches');
const middleware = require('../middleware');

module.exports = function (app) {
  app.get('/matches', middleware.isAuthenticated, matchesController.getMatches);
};
