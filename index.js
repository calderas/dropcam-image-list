var MailParser = require("mailparser").MailParser;
var mailparser = new MailParser({debug: false, showAttachmentLinks:true});
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var aws = require('aws-sdk');

var PORT= process.env.PORT || 5000;
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

// function getLocalEmail() {
//   fs.readFile( __dirname + '/2da3340edfa73952.raw', function (err, data) {
//     if (err) {
//       throw err;
//     }
//     var email = data.toString();
//     mailParserFn(email);
//   });
// }

function saveImage(image, name) {
  var f=fs.createWriteStream(name);
  f.write(image);
  f.end();
}

function uploadToS3(image, fileName) {
  aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
  var s3 = new aws.S3();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: image,
    Expires: 60,
    ContentType: "image/jpg",
    ACL: 'public-read'
  };
  s3.upload(s3_params, function(err, data){
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to myBucket/myKey");
    }
  });
}

function mailParserFn(email) {
  mailparser.on("end", function(mail_object){
    console.log("Date:", mail_object.date);
    console.log("Subject:", mail_object.subject);
    console.log(mail_object.attachments);
    if (mail_object.attachments) {
      mail_object.attachments.forEach(function(attachment){
        var name = new Date(mail_object.date).toISOString();
        name += ".jpeg";
        saveImage(attachment.content, name);
        uploadToS3(attachment.content, name);
      });
    }
  });
  mailparser.write(email);
  mailparser.end();
}

function handleRequest(request, response){
  if (request.method.toLowerCase() == 'post') {
    console.log("handleRequest");
    var form = new formidable.IncomingForm()
    form.parse(request, function(err, fields, files) {
      // console.log("form.parse");
      // console.log(fields["headers[From]"]);
      // console.log(fields["headers[Subject]"]);
      // console.log(fields["headers[Date]"]);

      mailParserFn(fields.message);
      response.writeHead(200, {'content-type': 'text/plain'})
      response.end('Message Received. Thanks!\r\n')
    });

    return;
  }
}

var server = http.createServer(handleRequest);
server.listen(PORT, function(){
  console.log("Server listening on: http://localhost:%s", PORT);
});
