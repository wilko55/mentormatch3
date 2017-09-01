'use strict';

const models = require('../models/');

const EmailLog = models.email;

module.exports = {
  log: function (senderId, recepientId, message, type) {
    return new Promise(function (resolve, reject) {
      EmailLog.create({ senderId: senderId, recepientId: recepientId, emailBody: message, type: type })
      .then(function () {
        // if a reply to a users email update emailLog to match replyEmailId to recieved email id

        // EmailLog.update({ replyEmailId: model.dataValues }, { where: { senderId: recepientId, recepientId: senderId, replyEmailId: null, type: 'email' } })
        // .then(function () {
        // });
        // return resolve(
        //     model.dataValues
        //   );
      }).catch(function (err) { console.log('LOGGER ERR', err); });
    });
  },
  remove: function (loggerId) {
    return EmailLog.findOne({ id: loggerId }).destroy();
  }
};
