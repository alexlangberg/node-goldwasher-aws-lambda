'use strict';

console.log('Loading function');

var gn = require('goldwasher-needle');

/**
 * Will be run by AWS Lambda.
 * event: goldwasher-needle options object from invocation of Lambda function.
 * @param event
 * @param context
 * @returns {*}
 */
exports.handler = function(event, context) {
  if (!event || !event.url) {
    return context.fail(new Error('Provide an event with at least an url.'));
  }

  if (!event.retry) {
    event.retry = {
      retries: 3,
      maxTimeout: 10000
    };
  }

  console.log('Requesting ' + event.url);

  gn(event.url, event, function(error, result) {
    if (error) {
      return context.fail(error);
    } else {
      return context.succeed({
        output: result
      });
    }
  });
};