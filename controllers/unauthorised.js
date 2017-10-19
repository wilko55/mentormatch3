'use strict';

const axios = require('axios');
const parseString = require('xml2js').parseString;
const config = require('../config').config();
const EmailSender = require('../helpers/emailSender');
const models = require('../models');

const User = models.user;
const validateEmail = require('../helpers/validation/emailValidation');
const crypto = require('../helpers/crypto');
const validation = require('../helpers/validation/emailValidation');

module.exports = {
  getBlog: (req, res) => {
    axios.get('https://medium.com/feed/@mentormatchuk')
      .then(function (xml) {
        parseString(xml.data, function (err, json) {
          res.send(json);
        });
      });
  },
  verifyEmail: (req, res) => {
    validateEmail.emailSuffix(req.body.workEmail).then((emailSuffixIsValid) => {
      let errorMessage;
      let helpMessage;
      if (!validateEmail.emailAddress(req.body.workEmail)) {
        errorMessage = 'Please enter a valid email address';
      } else if (!emailSuffixIsValid) {
        errorMessage = 'At the moment, this must be a UK Civil Service email address (e.g. ending in \'gov.uk\' or \'gov.scot\').<br>If there\'s a problem, please let us know at <a href="mailto:hello@mentormatch.org.uk">hello@mentormatch.org.uk</a>';
      }
      if (errorMessage) {
        res.render('verify-email', { title: config.title + ' - verify your email', workEmailSent: false, errorMessage: errorMessage, csrfToken: req.csrfToken() });
      } else {
        // check user already registered and send email if not
        User.findOne({ where: { $or: [
          { email: req.body.workEmail },
          { csEmail: req.body.workEmail },
          { emailOther: req.body.workEmail }
        ] } }).then((userData) => {
          if (!userData) {
            new EmailSender(null, 'verifyEmail', {}, 'Please verify your email', { email: req.body.workEmail }).sendToAnonUser();
          }
        });

        helpMessage = 'If that email isn\'t already associated with a profile, we\'ll send you a verification email in a few minutes. Click the link to verify your email.';
        res.render('verify-email', { title: config.title + ' - verify your email', workEmailSent: true, helpMessage: helpMessage, csrfToken: req.csrfToken() });
      }
    });
  },
  signUp: (req, res) => {
    if (typeof req.session === 'undefined') {
      req.session = {
        errors: {}
      };
    }
    // if no hash then redirect to homepage with flash warning
    let decryptSafeUrl = crypto.decrypt(req.params.hash);
    let email = decryptSafeUrl.split("?")[1];
    if (!validation.emailAddress(email)) {
      console.log('invalid email hash');
      res.redirect('/');
    } else {
      let emailLower = email.toLowerCase();
      req.session.workEmail = emailLower;
      User.findByEmail(emailLower)
      .then(function (userData) {
        if (userData) {
          if (userData.signedUp === 1) {
            res.render('signup', { emailExistsError: true, csrfToken: req.csrfToken() });
          } else {
            // user exists but they never completed signup - delete and let them complete signup again
            User.destroy.where({ id: userData.id })
            .then(function () {
              res.render('signup', { title: config.title + ' - Sign up', workEmail: email, errors: req.session.errors, csrfToken: req.csrfToken() });
            });
          }
        } else {
          res.render('signup', { title: config.title + ' - Sign up', workEmail: email, errors: req.session.errors, csrfToken: req.csrfToken() });
        }
      });
    }
  }
};
