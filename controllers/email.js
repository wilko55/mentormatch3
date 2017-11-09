'use strict';

const config = require('../config').config();
const model = require('../models');
const transformData = require('../helpers/transformData');
const base64url = require('base64url');
const logger = require('../helpers/logger');

const User = model.user;
const Email = model.email;

module.exports = {
  getInbox: (req, res) => {
    Email.findInboxEmails(req.user.id)
    .then((data) => {
      res.render('email-log', {
        sent: data.email,
        received: data.reply,
        title: config.title + ' - inbox' });
    });
  },
  getEmail: (req, res) => {
    let realId;

    if (base64url.decode(req.params.id).split('=')[0] === 'id') {
      realId = base64url.decode(req.params.id).split('=')[1];
    }

    if (req.user.mentorEmailsSent < 4) {
      User.findOne(({ where: { id: realId } }))
      .then((recepientData) => {
        let email = `Hello,\nMy name is ` + req.user.name + `,\n
I saw your profile on Mentor match and wondered if you might be interested in [mentoring / being mentored by] me?\n
I'm particularly interested in [learning more about/ sharing my experience of [...]\n
My goals are [to.... by......]\n
Thanks, \n` + req.user.name;
        let senderEmail = transformData.getCommsEmail(req.user);
        let recepientEmail = transformData.getCommsEmail(recepientData);
        let recepientFirstName = recepientData.get('name');
        let realGrade = transformData.convertGrade(recepientData.get('grade'));
        let additionalExperience = transformData.gotAdditionalExperience(recepientData);

        res.render('email', { title: config.title, email: email, recepientData: recepientData.attributes, userData: req.user, recepientFirstName: recepientFirstName, realGrade: realGrade, recepientEmail: recepientEmail, senderEmail: senderEmail, additionalExperience: additionalExperience, csrfToken: req.csrfToken() });
      }).catch(function (err) {
        logger.error('Error getting /emails page. User #' + req.user.id + '. Url: ' + req.url + '. Error: ' + err);
        res.redirect('/profile');
      });
    } else {
      res.redirect('../profile/?valid=false');
    }
  }
};
