'use strict';

const axios = require('axios');
const parseString = require('xml2js').parseString;
const config = require('../config').config();
const EmailSender = require('../helpers/emailSender');
const models = require('../models');

const User = models.user;

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
    let validateEmail = require('../helpers/validation/emailSuffixValidation');

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
            new EmailSender(null, 'verifyEmail', {}, 'Please verify your email').sendToAnonUser({ email: req.body.workEmail });
          }
        });

        helpMessage = 'If that email isn\'t already associated with a profile, we\'ll send you a verification email in a few minutes. Click the link to verify your email.';
        res.render('verify-email', { title: config.title + ' - verify your email', workEmailSent: true, helpMessage: helpMessage, csrfToken: req.csrfToken() });
      }
    });
  }
};
