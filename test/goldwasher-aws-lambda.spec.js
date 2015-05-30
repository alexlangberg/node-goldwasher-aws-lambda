'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var goldwasherAwsLambda = require('../lib/goldwasher-aws-lambda');

describe('running', function() {

  it('can run', function(done) {
    var context = {
      succeed: function(results) {
        results.length.should.be.greaterThan(0);
        results[0].source.should.equal('http://google.com');
        done();
      }
    };

    goldwasherAwsLambda.handler({url: 'http://google.com'}, context);
  });

});

describe('failures', function() {

  it('throws if no event is provided', function(done) {
    var context = {
      fail: function(error) {
        should.exist(error);
        done();
      }
    };

    goldwasherAwsLambda.handler(null, context);
  });

  it('throws if event has no url', function(done) {
    var context = {
      fail: function(error) {
        should.exist(error);
        done();
      }
    };

    goldwasherAwsLambda.handler({}, context);
  });

  it('handles errors from needle', function(done) {
    var context = {
      fail: function(error) {
        should.exist(error);
        done();
      }
    };

    var event = {
      url: 'foo',
      retry: {
        retries: 3,
        minTimeout: 0,
        maxTimeout: 1
      }
    };

    goldwasherAwsLambda.handler(event, context);
  });

});