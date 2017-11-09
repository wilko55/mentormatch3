"use strict";

const moment = require('moment');
const base64url = require('base64url');

module.exports = function (sequelize, DataTypes) {
  let Email = sequelize.define("email",
    {
      senderId: DataTypes.INTEGER,
      recepientId: DataTypes.INTEGER,
      sentStatus: DataTypes.INTEGER,
      timestamp: DataTypes.DATE,
      emailBody: DataTypes.STRING,
      replyEmailId: DataTypes.INTEGER,
      queueReminder: DataTypes.INTEGER,
      type: DataTypes.STRING,
      chaserSent: DataTypes.INTEGER,
      dormantWarningSent: DataTypes.INTEGER
    },
    {
      tableName: 'emailLog',
      timestamps: false
    }
  );

  Email.contactedMentors = function () {
    return sequelize.query('select emailLog.recepientId from emailLog inner join mentors on mentors.id=emailLog.senderId')
    .then((data) => {
      return data[0].map((el) => {
        return el.recepientId;
      });
    });
  };

  Email.associate = function (models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    Email.belongsTo(models.user, {
      onDelete: "CASCADE",
      foreignKey: {
        field: 'id',
        allowNull: true
      }
    });
  };

  Email.findInboxEmails = function (id) {
    return sequelize.query('select emailLog.id, type, timestamp, emailBody, name from emailLog inner join mentors on mentors.id=emailLog.recepientId where (emailLog.type = "email" AND emailLog.senderId = ' + id + ') OR (emailLog.type = "reply" AND emailLog.recepientId = ' + id + ') ORDER BY emailLog.timestamp DESC', { type: sequelize.QueryTypes.SELECT })
    .then((data) => {
      let emails = {
        email: [],
        reply: []
      };
      data.map((el) => {
        el.timestamp = moment(el.timestamp).format('HH:MM Do MMM YYYY');
        el.emailBody = el.emailBody.replace(/<br \/>/g, ' ');
        return el;
      });
      data.forEach((el) => {
        emails[el.type].push(el);
        if (el.type === 'reply') {
          el.idHash = base64url.encode('id=' + el.id);
        }
      });
      return emails;
    });
  };

  return Email;
};
