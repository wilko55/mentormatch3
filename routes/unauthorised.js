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
    // check is valid email
    // let workEmailLower = req.body.workEmail.toLowerCase();

    // DB.knex.raw("SELECT GROUP_CONCAT(emailSuffix SEPARATOR ',')FROM validEmailSuffixes").then(function (validEmailSuffixes) {
    //   let validEmails = validEmailSuffixes[0][0]['GROUP_CONCAT(emailSuffix SEPARATOR \',\')'].split(',');
    //   let length = validEmails.length;
    //   let workEmailValid = false;
    //   while (length--) {
    //     if (workEmailLower.indexOf(validEmails[length]) !== -1) {
    //       workEmailValid = true;
    //     }
    //   }
    //   if (!workEmailValid || !validation.validateEmail(req.body.workEmail)) {
    //     console.log('invalid email:', req.body.workEmail);
    //     let errorMessage = 'At the moment, this must be a UK Civil Service email address (e.g. ending in \'gov.uk\' or \'gov.scot\').<br>If there\'s a problem, please let us know at <a href="mailto:hello@mentormatch.org.uk">hello@mentormatch.org.uk</a>';
    //     res.render('verify-email', { title: config.title + ' - verify your email', isAuthenticated: isAuthenticated, testMode: testMode, workEmailSent: false, errorMessage: errorMessage, csrfToken: req.csrfToken() });
    //   } else if (req.body.workEmail.length > 0 && workEmailValid) {
    //     let workEmailPromise = null;
    //     DB.knex('mentors').where({ email: workEmailLower }).orWhere({ csEmail: workEmailLower }).orWhere({ emailOther: workEmailLower })
    //     .then(function (model) {
    //       if (model.length !== 0) {
    //         res.render('verify-email', { errorMessage: 'If that email isn\'t already associated with a profile, we\'ll send you a verification email in a few minutes. Click the link to verify your email.', csrfToken: req.csrfToken() });
    //       } else {
    //         new ReallyNewEmailSender(null, 'verifyEmail', {}, 'Please verify your email').sendToAnonUser({ email: req.body.workEmail });
    //
    //         let helpMessage = 'If that email isn\'t already associated with a profile, we\'ll send you a verification email in a few minutes. Click the link to verify your email.';
    //         res.render('verify-email', { title: config.title, testMode: testMode, workEmailSent: true, helpMessage: helpMessage, csrfToken: req.csrfToken() });
    //       }
    //     });
    //   }
    // });
};
