'use strict';

let base64url = require('base64-url');
let config = require('../../config').config();

let reply = function (userData, recepientData, emailData) {
  let pauseCommsLink = config.url + 'update-prefs/' + base64url.encode('comms?' + userData.email);
  let replyLink = config.url + 'reply/' + base64url.encode('id=' + userData.id);
  recepientData.firstName = recepientData.name.split(' ')[0];
  userData.firstName = userData.name.split(' ')[0];

  return `
        <head><meta charset="UTF-8">
        </head>
        <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
          <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
          Hi ` + recepientData.firstName + `</h2>
          <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">You have received a message from ` + userData.firstName + ` on <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a></p>
          <blockquote>`
            + emailData.newBody +
          `</blockquote>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">At this point, we'll leave you to reply directly to ` + userData.firstName + `. </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">Happy mentoring!</p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            The Mentor Match team
            <br />
            <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
          </p>
        </div>`;
};
module.exports = reply;
