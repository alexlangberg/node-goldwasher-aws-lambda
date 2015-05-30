// jscs:disable requireCamelCaseOrUpperCaseIdentifiers
'use strict';

var chai = require('chai');
chai.use(require('chai-things'));
var should = chai.should();
var goldwasher = require('goldwasher');
var goldwasherNeedle = require('../lib/goldwasher-needle');
var http = require('http');
var R = require('ramda');
var defaultOptions = {
  retry: {
    minTimeout: 0,
    maxTimeout: 0
  }
};
var serverUrl = 'http://localhost:1337';
var url = serverUrl + '/200';
var server;

before(function(done) {
  var failures = 0;
  server = http.createServer(function(request, response) {
    var code = request.url.substring(1);

    if (request.url === '/200') {
      response.writeHead(code, {'Content-Type': 'text/plain'});
      response.end('<p>Hello World</p>');
    }

    if (request.url === '/301' || request.url === '/302') {
      response.writeHead(code, {'Content-Type': 'text/plain'});
      response.end('<p>Not found</p>');
    }

    if (request.url === '/404') {
      response.writeHead(code, {'Content-Type': 'text/plain'});
      response.end('<p>Not found</p>');
    }

    if (request.url === '/thirdtimeacharm') {
      if (failures < 2) {
        failures++;
        response.writeHead(500, {'Content-Type': 'text/plain'});
        response.end('<p>Server error!</p>');
      } else {
        response.writeHead(200, {'Content-Type': 'text/plain'});
        response.end('<p>Hello World</p>');
      }
    }
  }).listen(1337);

  server.on('listening', function() {
    done();
  });
});

after(function() {
  server.close();
});

describe('initialization', function() {

  it('loads', function(done) {
    goldwasher.should.have.property('needle');
    done();
  });

  it('loads without options', function(done) {
    goldwasher.needle(url, function(error, result, response) {
      done();
    });
  });

  it('loads with options', function(done) {
    var options = {
      goldwasher: {
        selector: 'p'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      done();
    });
  });

});

describe('running', function() {

  it('can request and goldwash a site', function(done) {
    goldwasher.needle(url, function(error, result, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      result.should.be.an('array');
      result.length.should.be.greaterThan(0);
      result[0].source.should.not.equal(null);
      done();
    });
  });

  it('can request and goldwash a site with options', function(done) {
    var options = {
      goldwasher: {
        selector: 'h1, h2, h3, h4, h5, h6, p'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      result.should.be.an('array');
      result.length.should.be.greaterThan(0);
      result[0].source.should.not.equal(null);
      done();
    });
  });

  it('can request and return a raw site', function(done) {
    var options = {
      goldwasher: {
        output: 'raw'
      }
    };

    goldwasher.needle(url, options, function(error, result, response) {
      should.not.exist(error);
      response.statusCode.should.equal(200);
      result.should.be.a('string');
      done();
    });
  });

});

describe('failures', function() {

  it('handles errors from needle', function(done) {
    goldwasher.needle('foo', defaultOptions, function(error, result, response) {
      should.exist(error);
      done();
    });
  });

  it('throws on too many redirects', function(done) {
    var options = R.merge(defaultOptions, {
      needle: {
        follow_max: 0
      }
    });
    var url = serverUrl + '/301';

    goldwasher.needle(url, options, function(error, result, response) {
      should.exist(error);
      response.statusCode.should.be.within(301, 302);
      done();
    });
  });

  it('throws on 404', function(done) {
    var url = serverUrl + '/404';
    goldwasher.needle(url, defaultOptions, function(error, result, response) {
      should.exist(error);
      response.statusCode.should.equal(404);
      done();
    });
  });

  it('throws on disallowed header', function(done) {
    var options = R.merge(defaultOptions, {
      goldwasherNeedle: {
        disallowHeader: 'content-type'
      }
    });

    goldwasher.needle(url, options, function(error, result, response) {
      should.exist(error);
      done();
    });
  });
});

describe('retrying', function() {

  it('can retry on failure', function(done) {
    goldwasher.needle(
      serverUrl + '/thirdtimeacharm',
      defaultOptions,
      function(error, result) {
        should.not.exist(error);
        result.length.should.equal(1);
        result[0].text.should.equal('Hello World');
        done();
      });
  });

});