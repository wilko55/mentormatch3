'use strict';

const config = require('../config').config();
const middleware = require('../middleware');
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });
let unauthedController = require('../controllers/unauthorised');
// let mailgun = require('mailgun-js')({ apiKey: config.mailgun.apiKey, domain: 'mentormatch.org.uk' });
const _ = require('underscore');

module.exports = function (app) {
  const staticRoutes = [
    { template: 'info/help', url: '/help' },
    { template: 'info/dpp', url: '/dpp' },
    { template: 'index', url: '/' },
  ];

  _.each(staticRoutes, (page) => {
    app.get(page.url, (req, res) => {
      res.render(page.template);
    });
  });

  app.get('/blog', unauthedController.getBlog);

  app.get('/verify-email', middleware.sendAuthedUserToProfile, csrfProtection, function (req, res) {
    res.render('verify-email', { title: config.title + ' - verify your email', csrfToken: req.csrfToken() });
  });

  app.post('/verify-email', middleware.sendAuthedUserToProfile, csrfProtection, unauthedController.verifyEmail);

  app.get('/signup/:hash', csrfProtection, unauthedController.signUp);
};
