'use strict';

const models = require('../models');

module.exports = {
  // example controller
  getProfile: (req, res) => {
    models.User.findOne({ where: { guid: 1234 } })
    .then(function (userData) {
      res.render('profile', { data: userData });
    });
  }
};
