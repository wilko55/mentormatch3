'use strict';

// Sequelize boilderplate stuff - takes the other models and loads them into sequelize so it knows about them

const config = require('../config').config();
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};
const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});

fs
  .readdirSync(__dirname)
  .filter(function (file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if ('associate' in db[modelName]) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;