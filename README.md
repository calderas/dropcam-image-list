Useful to keep a log history of images sent with notification emails.

## Tools
* Heroku
* AWS S3
* CloudMailIn

## Setup
* npm install
* create s3 bucket
* setup .env file *(see env.default)*
* create heroku app
* set heroku config vars
* add CloudMailIn addon
* git push heroku master
* forward emails to new CloudMailIn address
* profit

## Libs
* [aws-sdk](https://github.com/aws/aws-sdk-js)
* [express](https://github.com/strongloop/express/)
* [formidable](https://github.com/felixge/node-formidable)
* [mailparser](https://github.com/andris9/mailparser)
* [react](https://facebook.github.io/react/)

## Constraints
* CloudMailIn free plan has a limit of 200 emails per month
