'use strict';

const axios = require('axios');
const parseString = require('xml2js').parseString;
const config = require('../config').config();

module.exports = {
  getBlog: (req, res) => {
    axios.get('https://medium.com/feed/@mentormatchuk')
      .then(function (xml) {
        parseString(xml.data, function (err, json) {
          res.send(json);
        });
      });
  },
  login: (req, res) => {
    if (req.isAuthenticated()) {
      res.redirect('profile');
    } else {
      res.render('login', { title: config.title + ' - Login' });
    }
  }
};
