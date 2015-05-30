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
This module installs as a module on AWS Lambda, as a zip file.
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

## Build
If you feel like changing the code and have installed the development dependencies, you can automatically build a new zip file from the main folder:
```
gulp zip
```
This will create a new zip that can be installed with the commands mentioned under *installation*.