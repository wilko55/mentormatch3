'use strict';

module.exports = function (sequelize, DataTypes) {
  let ValidEmailSuffixes = sequelize.define("validEmailSuffixes",
    {
      emailSuffix: DataTypes.STRING
    },
    {
      tableName: 'validEmailSuffixes',
      timestamps: false
    }
  );

  return ValidEmailSuffixes;
};
