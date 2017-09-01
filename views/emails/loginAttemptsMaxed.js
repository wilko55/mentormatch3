'use strict';

const crypto = require('../../helpers/crypto');
let config = require('../../config').config();
let moment = require('moment');

let passwordReset = function (emailData) {
  // generate hash here?

  // track sent email - add col for passwordreset
  let time = moment();
  let toHash = time + '?' + emailData.email + '?' + emailData.guid;
  let resetLink = config.url + 'reset-password/' + crypto.encrypt(toHash);

  return `
        <head>
          <meta charset="UTF-8">
        </head>
        <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
          <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
          Resetting your Mentor Match password</h2>
          <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
          <p style="line-height:21px;margin-bottom:21px">There have been too many unsuccessful login attempts to your account on Mentor Match. Please, <a href="` + resetLink + `" target="_blank" style="text-decoration:none"><span style="padding:3px; background-color: #04AAC9 ;color:#FFFFFF;">click here</span></a> to reset your password. This link will expire in a few minutes.</p>
        </div>`;
};

module.exports = passwordReset;
