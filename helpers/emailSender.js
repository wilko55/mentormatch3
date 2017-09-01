'use strict';

const config = require('../config').config();
const mailgun = require('mailgun-js')({ apiKey: config.mailgun.apiKey, domain: 'mentormatch.org.uk' });
const emailLogger = require('./emailLogger');
const emailTemplates = require('../views/emails/');
const crypto = require('./crypto');
const models = require('../models');

const User = models.user;

class EmailSender {
  constructor(recepientId, emailType, senderId, subject, emailData) {
    this.recepientId = recepientId;
    this.emailType = emailType;
    this.senderId = senderId;
    this.subject = subject;
    this.emailData = emailData;
  }

  static getCorrectEmail(userData) {
    if (userData.commsEmail === 1) {
      return userData.csEmail;
    } else if (userData.commsEmail === 2) {
      return userData.emailOther;
    } else {
      return userData.email;
    }
  }

  static getUserData(anId) {
    // return DB.knex('mentors').select('id', 'name', 'commsEmail', 'email', 'csEmail', 'emailOther', 'guid').where({ id: anId })
    return User.findOne({ id: anId })
      .then(function (userData) {
        let data = userData[0];
        data.preferredEmail = EmailSender.getCorrectEmail(userData[0]);
        return data;
      });
  }

  static getEmailBody(data) {
    let emailBody;
    if (data.emailData) {
      emailBody = data.emailData.emailBody.replace(new RegExp('\r?\n', 'g'), '<br />');
    } else {
      emailBody = data.emailType;
    }
    console.log('emailBDOY::', emailBody);
    return emailBody;
  }

  sendEmail() {
    let senderData;
    let recepientData;
    let that = this;
    // get sender data
    EmailSender.getUserData(this.senderId)
    .then((data) => {
      senderData = data;
    })
    .then(() => {
      // get recepiend data
      EmailSender.getUserData(this.recepientId)
      .then((data) => {
        recepientData = data;
      })
      .then(() => {
        // prep email data
        if (that.emailData) {
          that.emailData.newBody = EmailSender.getEmailBody(this);
        } else {
          that.emailData = {};
        }

        let data = {
          from: 'Mentor Match <hello@mentormatch.org.uk>',
          to: recepientData.preferredEmail,
          subject: this.subject || 'Hello from MentorMatch!',
          html: ''
        };

        // log email first so we have access to logged email id
        emailLogger.log(senderData.id, recepientData.id, that.emailData.newBody, this.emailType)
        .then(function (loggerData) {
          that.emailData.logId = loggerData;

          if (that.emailData) {
            data.html = emailTemplates[that.emailType](senderData, recepientData, that.emailData);
          } else {
            data.html = emailTemplates[that.emailType](senderData, recepientData);
          }

          let hashedReplyUrl = crypto.encrypt('senderEmail=' + senderData.preferredEmail + '&senderId=' + senderData.id + '&recepientId=' + recepientData.id + '&logId=' + that.emailData.logId);
          data['h:Reply-To'] = 'reply-' + hashedReplyUrl + '@reply.mentormatch.org.uk';
          // try to send email - fall back and remove from log if problem
          mailgun.messages().send(data, function (error) {
            if (error) {
              console.log('error!', error);
              emailLogger.remove(that.emailData.logId);
            }
          });
        }).catch(function (err) { console.log('Email sender error', err); });
      });
    });
  }

  sendToSelf(emailData) {
    let recepientData;
    let that = this;

    // get recepient data
    EmailSender.getUserData(that.recepientId)
    .then((data) => {
      recepientData = data;
      recepientData.email = EmailSender.getCorrectEmail(recepientData);
    })
    .then(() => {
      let data = {
        from: 'Mentor Match <hello@mentormatch.org.uk>',
        to: EmailSender.getCorrectEmail(recepientData),
        subject: that.subject || 'Hello from Mentor Match!',
        html: emailTemplates[that.emailType](recepientData, emailData)
      };
      mailgun.messages().send(data, function (error) {
        emailLogger.log(recepientData.id, recepientData.id, 'Send to self', that.emailType)
        if (error) {
          console.log('To self email error', error);
        }
      });
    });
  }

  sendToAnonUser(emailData) {
    let recepientData;
    let that = this;

    recepientData = {
      email: emailData.email
    };
    let data = {
      from: 'Mentor Match <hello@mentormatch.org.uk>',
      to: recepientData.email,
      subject: that.subject || 'Hello from Mentor Match!',
      html: emailTemplates[that.emailType](recepientData, emailData)
    };

    User.findOne({ where: { $or: [
      { email: recepientData.email },
      { csEmail: recepientData.email },
      { emailOther: recepientData.email }
    ] } })
    .then(function (model) {
      if (model.length > 0) {
        recepientData.guid = model[0].guid;
        mailgun.messages().send(data, function (error) {
          emailLogger.log(0, recepientData.id, 'Send to anon - sending to user ' + model[0].id, that.emailType);
          if (error) {
            console.log('To anon email error', error);
          }
        });
      } else {
        mailgun.messages().send(data, function (error) {
          emailLogger.log(0, recepientData.id, 'Send to anon - no user found', that.emailType);
          if (error) {
            console.log('To anon email error', error);
          }
        });
      }
    })
    .catch((err) => {
      console.log('no guid', err);
      mailgun.messages().send(data, function (error) {
        emailLogger.log(0, recepientData.id, 'Send to anon - error no guid', that.emailType);
        if (error) {
          console.log('To anon email error', error);
        }
      });
    });
  }
}


// get user details
module.exports = EmailSender;
