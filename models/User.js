'use strict';

module.exports = function (sequelize, DataTypes) {
  let User = sequelize.define("User",
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      guid: DataTypes.INTEGER,
      profession: DataTypes.STRING
    },
    {
      tableName: 'mentors',
      timestamps: false
    }
  );

  User.associate = function (models) {
    User.hasMany(models.Email);
  };

  return User;
};
