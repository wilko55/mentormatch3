"use strict";

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

  return Email;
};
