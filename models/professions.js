'use strict';

module.exports = function (sequelize, DataTypes) {
  let Professions = sequelize.define("professions",
    {
      profession: DataTypes.STRING,
      profKey: DataTypes.STRING
    },
    {
      tableName: 'professions',
      timestamps: false
    }
  );

  Professions.findAllProfessions = function () {
    return sequelize.query('select profession from professions order by profession asc');
  };


  return Professions;
};
