'use strict';

// let base64url = require('base64-url');
let config = require('../../config').config();
const crypto = require('../../helpers/crypto');

let validateEmail = function (userData, emailData) {
  // create hash - add timestamp?
  let toHash = 'csEmail?' + userData.email;
  let verifyLink = config.url + 'signup/' + crypto.encrypt(toHash);
  // add to log
  return `
      <head>
        <meta charset="UTF-8">
      </head>
      <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
        <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
        Confirm your Civil Service email address</h2>
        <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
        <p style="line-height:21px;margin-bottom:21px">In order to start viewing mentor matches and to send and receive messages <a href="` + verifyLink + `" target="_blank" style="text-decoration:none"><span style="padding:3px; background-color: #04AAC9 ;color:#FFFFFF;">click here</span></a> to validate your email address.</p>
        <p style="font-size:14px;line-height:21px;margin-bottom:21px">Happy mentoring!<br />
          The Mentor Match team
          <br />
          <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
        </p>
      </div>
    `;
};

module.exports = validateEmail;
