var google = require('googleapis');
var sendSampleMail=function (auth,id,src,des,template,cb) {
    var gmailClass = google.gmail('v1');
    // console.log(auth);
    var email_lines = [];
    var recipients=des.join();
    email_lines.push("From:"+src);
    console.log("Send mail sender: "+src);
    email_lines.push("To:"+recipients);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: this would be the subject');
    email_lines.push('');
    email_lines.push(template);

    var email = email_lines.join('\r\n').trim();

    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    gmailClass.users.messages.send({
      auth: auth,
      //userId: id,
      userId: "me",
      resource: {
        raw: base64EncodedEmail
      }
    }, cb);
  }
module.exports=sendSampleMail;
