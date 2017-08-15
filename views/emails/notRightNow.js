'use strict';

let config = require('../../config').config();

let notRightNow = function (userData, recepientData) {
  recepientData.firstName = recepientData.name.split(' ')[0];
  userData.firstName = userData.name.split(' ')[0];
  return `
        <head>
          <meta charset="UTF-8">
        </head>
        <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
          <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
          Hi ` + recepientData.firstName + `</h2>
          <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            Thanks for contacting someone through the <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">Mentor Match</a> platform. Unfortunately, they've decided that now isn't the right time for them to start a mentoring relationship with you.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            We know this can be disappointing to hear, so please do head back to Mentor Match, and contact someone else on the system.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            It can sometimes take time to find a mentoring relationship that's right for you. Why not update, or add more information to your <a href="` + config.url + `profile" style="color:#469abd;text-decoration:underline" target="_blank">profile</a>? You can also review more of your matches <a href="` + config.url + `matches" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">here</span></a>.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            The Mentor Match team
            <br />
            <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
          </p>
        </div>`;
};

module.exports = notRightNow;
