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
      console.log('!!', data)
    // })

    // DB.knex('emailLog').select('name', 'emailLog.id', 'type', 'timestamp', 'emailBody').join('mentors', 'mentors.id', '=', 'emailLog.recepientId')
    //   .where({ 'emailLog.senderId': req.user.id })
    //   .andWhere({ 'emailLog.type': 'email' })
    //   .orWhere({ 'emailLog.senderId': req.user.id })
    //   .andWhere({ 'emailLog.type': 'reply' })
    //   .orderBy('emailLog.id', 'desc')
    //   .select()
    //   .then(function (sentEmails) {
    //     let i;
    //     for (i = 0; i < sentEmails.length; i += 1) {
    //       if (typeof sentEmails[i].emailBody != null) {
    //         sentEmails[i].emailBody = sentEmails[i].emailBody.replace(/<br \/>/g, ' ');
    //       }
    //     }
    //     DB.knex('emailLog').select('name', 'mentors.id', 'email', 'timestamp', 'emailBody').join('mentors', 'mentors.id', '=', 'emailLog.senderId')
    //     .where({ 'emailLog.recepientId': req.user.id, 'emailLog.type': 'email' })
    //     .orWhere({ 'emailLog.recepientId': req.user.id })
    //     .andWhere({ 'emailLog.type': 'reply' })
    //     .orderBy('timestamp', 'desc')
    //     .select()
    //     .then(function (receivedEmails) {
    //       let j;
    //       for (j = 0; j < receivedEmails.length; j += 1) {
    //         console.log(receivedEmails[j])
    //         receivedEmails[j].idHash = base64url.encode('id=' + receivedEmails[j].id);
    //         if (receivedEmails[j].emailBody == null) {
    //           receivedEmails[j].emailBody = '';
    //         } else {
    //           receivedEmails[j].emailBody = receivedEmails[j].emailBody.replace(/<br \/>/g, ' ');
    //         }
    //       }
          res.render('email-log', {
            sent: data,
            // received: receivedEmails,
            title: config.title + ' - inbox' });
        });
      // });
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
