'use strict';

let base64url = require('base64-url');
let config = require('../../config').config();

let email = function (userData, recepientData, emailData) {
  let replyLink = config.url + 'reply/' + base64url.encode('id=' + userData.id);
  let pauseCommsLink = config.url + 'update-prefs/' + base64url.encode('comms?' + userData.email);
  recepientData.firstName = recepientData.name.split(' ')[0];
  userData.firstName = userData.name.split(' ')[0];
  let reminderLink = config.url + 'reply/followup/' + base64url.encode('reminder=' + userData.email + '&senderId=' + userData.id + '&recepientId=' + recepientData.id + '&logId=' + emailData.logId);
  let notRightLink = config.url + 'reply/followup/' + base64url.encode('not-right=' + userData.email + '&id=' + recepientData.id + '&userID=' + userData.id);

  return `
        <head>
          <meta charset="UTF-8">
        </head>
        <div style="background:#f5f6f9;color:#666;font-family:Helvetica,arial,sans-serif;max-width:500px;padding:20px" bgcolor="#F5F6F9">
          <h2 style="font-family:'Museo Sans Rounded 300',arial,sans-serif;font-size:26px;font-weight:normal;line-height:39px;margin-bottom:26px">
          Hi ` + recepientData.firstName + `</h2>
          <hr style="border:#ddd solid 1px;clear:both;min-height:0;margin-bottom:30px;margin-top:30px">
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">You have received a message from ` + userData.name + ` on <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a></p>
          <blockquote>`
            + emailData.newBody +
          `</blockquote>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            Now you can now find out more about and <a href="` + replyLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">reply to ` + userData.firstName + `</span></a>.
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            You can also <a href="` + reminderLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">set a reminder</span></a> if you don't want to reply right now. Or, if you don't think you'd be a good fit, we can <a href="` + notRightLink + `" target="_blank" style="text-decoration:none"><span style="padding:5px; background-color: #04AAC9 ;color:#FFFFFF;">let them know</span></a>
          </p>
          <p style="font-size:14px;line-height:21px;margin-bottom:21px">
            The Mentor Match team
            <br />
            <a href="http://www.mentormatch.org.uk" style="color:#469abd;text-decoration:underline" target="_blank">mentormatch.org.uk</a>
          </p>
          <p style="font-size:11px;line-height:21px;margin-bottom:21px">If you are already have a mentor and are not looking to take on another, <a href="` + pauseCommsLink + `" target="_blank">click here</a> to pause your messages. Bear in mind that by pausing, you will not be able to view your mentee matches.</p>
        </div>`;
};


module.exports = email;
