# node-goldwasher-aws-lambda
[![npm version](http://img.shields.io/npm/v/goldwasher-aws-lambda.svg)](https://www.npmjs.org/package/goldwasher-aws-lambda)
[![Build Status](http://img.shields.io/travis/alexlangberg/node-goldwasher-aws-lambda.svg)](https://travis-ci.org/alexlangberg/node-goldwasher-aws-lambda)
[![Coverage Status](http://img.shields.io/coveralls/alexlangberg/node-goldwasher-aws-lambda.svg)](https://coveralls.io/r/alexlangberg/node-goldwasher-aws-lambda?branch=master)
[![Code Climate](http://img.shields.io/codeclimate/github/alexlangberg/node-goldwasher-aws-lambda.svg)](https://codeclimate.com/github/alexlangberg/node-goldwasher-aws-lambda)

[![Dependency Status](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda.svg)](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda)
[![devDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda/dev-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda#info=devDependencies)
[![peerDependency Status](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda/peer-status.svg)](https://david-dm.org/alexlangberg/node-goldwasher-aws-lambda#info=peerDependencies)

A version of [goldwasher](https://www.npmjs.org/package/goldwasher) that runs as a module on AWS Lambda. Uses [goldwasher-needle](https://www.npmjs.org/package/goldwasher-needle) for requests.

## Installation
This module installs as a module on AWS Lambda, as a zip file. You can either just download the zip from ```/dist``` and upload it via your AWS console or install it via aws-cli. The first one might not always work so the method with aws-cli described below is recommended:
```
npm install goldwasher-aws-lambda
cd node_modules/goldwasher-aws-lambda/dist/
aws lambda create-function --function-name goldwasher --timeout 60 --zip-file fileb://goldwasher-aws-lambda.zip
```
You can of course replace ```goldwasher``` with your name of choice and ```60``` with a lower timeout if necessary.

If you later need to overwrite it and the function name already exists on AWS, use this instead:
```
aws lambda update-function-code --function-name goldwasher --zip-file fileb://goldwasher-aws-lambda.zip
```

## Options
The module accepts the usual parameters of [goldwasher-needle](https://www.npmjs.org/package/goldwasher-needle) with the exception that the ```url``` and ```options``` parameters have been merged. This simply means that the first parameter, ```url```, has been removed and must instead be added as a property on the ```options``` parameter:
```javascript
{
  url: 'http://github.com',
  goldwasher: {
    selector: 'h1'
  }
}
```
See how to use this in the examples below or simply paste it as a sample event in the AWS console.

## Build
If you feel like changing the code and have installed the development dependencies, you can automatically build a new zip file from the main folder:
```
gulp zip
```
This will create a new zip that can be installed with the commands mentioned under *installation*.

## Example
In this example we will show how to consume the Lambda function from a client. First, install the [aws-sdk](https://www.npmjs.com/package/aws-sdk):

```npm install aws-sdk```

In this example, we will use a config file for our AWS credentials. Remember to replace the values below with your own.

**IMPORTANT**:
It is **extremely** important that you do **not** push this file to your git repository or **any other public place**. I **highly** recommend using [environment variables](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Environment_Variables) instead. I also recommend creating a user on AWS that only has the permission ```AWSLambdaRole``` to run this.

**aws-config.json**:

```javascript
{ 
	"accessKeyId": "akid",
	"secretAccessKey": "secret",
	"region": "us-east-1"
}
```

**example.js**:

```javascript
var AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-config.json');

var lambda = new AWS.Lambda();

lambda.invoke({
	FunctionName: 'goldwasher',
	Payload: JSON.stringify({url: 'http://google.com'})
},
function(error, data) {
	if (error) {
		console.error(error);	
	}
	console.log(data);
});
```