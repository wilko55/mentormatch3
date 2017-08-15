'use strict';

let base64url = require('base64-url');
let config = require('../../config').config();

let reminder = function (userData, recepientData, emailData) {
  recepientData.firstName = recepientData.name.split(' ')[0];
  userData.firstName = userData.name.split(' ')[0];
  let replyLink = config.url + 'reply/' + base64url.encode('id=' + userData.id);
  let notRightLink = config.url + 'reply/followup/' + base64url.encode('not-right=' + userData.email + '&id=' + recepientData.id + '&userID=' + userData.id);
  return `<head>
      <meta charset="UTF-8">
    </head>
    <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
      <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
      Hi ` + recepientData.firstName + `</h2>
      <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
      <p style="font-size:14px;line-height:21px;margin-bottom:21px">You've asked us to remind you that you've been contacted by ` + userData.firstName + ` via <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a></p>
      <blockquote>` + emailData.emailBody + `</blockquote>
      <p style="font-size:14px;line-height:21px;margin-bottom:21px">
        The system relies on people responding to emails - even if that is to tell them that now isn't the right time for you to start the mentoring relationship.
      </p>
      <p style="font-size:14px;line-height:21px;margin-bottom:21px">
        Please click here to <a href="` + replyLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">reply to ` + userData.firstName + ` now</span></a>
        or if <a href="` + notRightLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">now isn't the right time</span></a> for you we can send the person an automated message to let them know.
      </p>
      <p style="font-size:14px;line-height:21px;margin-bottom:21px">
        It's important to let the person know either way, so that you can start talking about the mentoring relationship that will work best for both of you, or they can approach other people.
      </p>
      <p style="font-size:14px;line-height:21px;margin-bottom:21px">
        The Mentor Match team
        <br />
        <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
      </p>
      <p style="font-size:11px;line-height:21px;margin-bottom:21px">You can view your profile to review your settings at any time.</p>
    </div>`;
};
module.exports = reminder;
