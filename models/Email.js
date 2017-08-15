"use strict";

module.exports = function (sequelize, DataTypes) {
  let Email = sequelize.define("Email", {
    title: DataTypes.STRING
  });

  Email.associate = function (models) {
    // Using additional options like CASCADE etc for demonstration
    // Can also simply do Task.belongsTo(models.User);
    Email.belongsTo(models.User, {
      onDelete: "CASCADE",
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Email;
};
