'use strict';

const matchesController = require('../controllers/matches');
const middleware = require('../middleware');
const csurf = require('csurf');

let csrfProtection = csurf({ cookie: true });

module.exports = function (app) {
  app.get('/matches', middleware.isAuthenticated, matchesController.getMatches);
  app.post('/matches', csrfProtection, matchesController.postMatches);
};
