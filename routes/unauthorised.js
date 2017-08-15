'use strict';

const config = require('../config').config();
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });
let unauthedControllers = require('../controllers/unauthorised');
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

  app.get('/blog', unauthedControllers.getBlog);
  app.get('/login', csrfProtection, unauthedControllers.login);
  app.get('/verify-email', csrfProtection, function (req, res) {
    res.render('verify-email', { title: config.title + ' - verify your email', csrfToken: req.csrfToken() });
  });
};
