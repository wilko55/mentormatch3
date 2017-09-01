"use strict";

module.exports = function (sequelize, DataTypes) {
  let Email = sequelize.define("email",
    {
      emailBody: DataTypes.STRING
    },
    {
      tableName: 'emailLog',
      timestamps: false
    }
  );

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
