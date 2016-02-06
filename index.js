var aws = require('aws-sdk');
var express = require('express');
var formidable = require('formidable');
var fs = require('fs');
var http = require('http');
var MailParser = require("mailparser").MailParser;

var app = express();

var PORT = process.env.PORT || 5000;
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;

function saveImage(image, name) {
  var f = fs.createWriteStream(name);
  f.write(image);
  f.end();
}

function uploadToS3(image, fileName) {
  console.log("uploading to S3", fileName);
  var s3 = awsConfig();
  var s3_params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Body: image,
    Expires: 60,
    ContentType: "image/jpg",
    ACL: 'public-read'
  };
  s3.upload(s3_params, function(err, data) {
    if (err) {
      console.log("Error uploading data: ", err);
    } else {
      console.log("Successfully uploaded data to:", fileName);
    }
  });
}

function getList(cb) {
  var s3 = awsConfig();
  var params = {
    Bucket: S3_BUCKET
  };
  s3.listObjects(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else {
      cb(data);
    }
  });
}

function awsConfig() {
  aws.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY
  });
  return new aws.S3();
}

function mailParserFn(email) {
  console.log("mailParserFn");
  var mailparser = new MailParser();
  mailparser.on("end", function(mail_object) {
    console.log("mailParserFn end");
    console.log("Date:", mail_object.date);
    console.log("Subject:", mail_object.subject);
    if (mail_object.attachments) {
      console.log("attachments:", mail_object.attachments.length);
      mail_object.attachments.forEach(function(attachment) {
        console.log("attachment");
        var name = new Date(mail_object.date).toISOString();
        name += ".jpeg";
        // saveImage(attachment.content, name);
        uploadToS3(attachment.content, name);
      });
    }
  });
  mailparser.write(email);
  mailparser.end();
}

function uploadRequest(request, response) {
  console.log("uploadRequest");
  var form = new formidable.IncomingForm()
  form.parse(request, function(err, fields, files) {
    mailParserFn(fields.message);
    response.writeHead(200, {
      'content-type': 'text/plain'
    })
    response.end('Message Received. Thanks!\r\n')
  });

  return;
}

app.set('port', (PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  getList(function(data) {
    response.render('pages/index', {
      data: data
    });
  });
});

app.post('/', function(request, response) {
  uploadRequest(request, response);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
