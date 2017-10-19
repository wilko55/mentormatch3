'use strict';

module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("user",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      guid: DataTypes.INTEGER,
      profession: DataTypes.STRING,
      dormant: DataTypes.INTEGER,
      dormantDate: DataTypes.TIME,
      joinDate: DataTypes.TIME,
      currentRole: DataTypes.TEXT,
      toDevelop1: DataTypes.STRING,
      toDevelop1About: DataTypes.TEXT,
      toDevelop1Level: DataTypes.INTEGER,
      toDevelop2: DataTypes.STRING,
      toDevelop2About: DataTypes.TEXT,
      toDevelop2Level: DataTypes.INTEGER,
      toDevelop3: DataTypes.STRING,
      toDevelop3About: DataTypes.TEXT,
      toDevelop3Level: DataTypes.INTEGER,
      toDevelop4: DataTypes.STRING,
      toDevelop4About: DataTypes.TEXT,
      toDevelop4Level: DataTypes.INTEGER,
      toDevelop5: DataTypes.STRING,
      toDevelop5About: DataTypes.TEXT,
      toDevelop5Level: DataTypes.INTEGER,
      toDevelop6: DataTypes.STRING,
      toDevelop6About: DataTypes.TEXT,
      toDevelop6Level: DataTypes.INTEGER,
      toOffer1: DataTypes.STRING,
      toOffer1About: DataTypes.TEXT,
      toOffer1Level: DataTypes.INTEGER,
      toOffer2: DataTypes.STRING,
      toOffer2About: DataTypes.TEXT,
      toOffer2Level: DataTypes.INTEGER,
      toOffer3: DataTypes.STRING,
      toOffer3About: DataTypes.TEXT,
      toOffer3Level: DataTypes.INTEGER,
      toOffer4: DataTypes.STRING,
      toOffer4About: DataTypes.TEXT,
      toOffer4Level: DataTypes.INTEGER,
      toOffer5: DataTypes.STRING,
      toOffer5About: DataTypes.TEXT,
      toOffer5Level: DataTypes.INTEGER,
      toOffer6: DataTypes.STRING,
      toOffer6About: DataTypes.TEXT,
      toOffer6Level: DataTypes.INTEGER,
      location: DataTypes.STRING,
      grade: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      phone: DataTypes.INTEGER,
      faceToFace: DataTypes.INTEGER,
      mentoring: DataTypes.INTEGER,
      coaching: DataTypes.INTEGER,
      linkedInId: DataTypes.STRING,
      minimumMentorGrade: DataTypes.STRING,
      mentorEmailsSent: DataTypes.INTEGER,
      repliesSent: DataTypes.INTEGER,
      goal: DataTypes.TEXT,
      signedUp: DataTypes.INTEGER,
      pauseMentoringComms: DataTypes.INTEGER,
      aboutMe: DataTypes.TEXT,
      password: DataTypes.STRING,
      csEmail: DataTypes.STRING,
      csVerified: DataTypes.INTEGER,
      admin: DataTypes.INTEGER,
      adminLevel: DataTypes.INTEGER,
      loginAttempts: DataTypes.INTEGER,
      commsEmail: DataTypes.INTEGER,
      emailOther: DataTypes.STRING,
      bame: DataTypes.INTEGER,
      lgbtq: DataTypes.INTEGER,
      disability: DataTypes.INTEGER,
      partTime: DataTypes.INTEGER,
      dependents: DataTypes.INTEGER,
      gender: DataTypes.INTEGER,
      transferred: DataTypes.INTEGER,
      verifiedDate: DataTypes.TIME,
      strikes: DataTypes.INTEGER,
      totalStrikes: DataTypes.INTEGER
    },
    {
      tableName: 'mentors',
      timestamps: false
    }
  );

  User.associate = function (models) {
    User.hasMany(models.email);
  };

  User.findByEmail = function (email) {
    return User.findOne({ where: { $or: [
      { email: email },
      { csEmail: email },
      { emailOther: email }
    ] } });
  };

  return User;
};
