var app = require('../main.js');
var assert = require('assert');
var fs = require('fs');
var qs = require('querystring');
var redis = require('redis');
var request = require('request');

var base_url = 'http://localhost:8080/';
var track_url = base_url+'track';

var queryObj = { "name": "Test", "count": "10" };
var query = '?'+qs.stringify(queryObj);
var file = 'log.json';

describe('App', function() {
    
    after(function(done){
       app.closeServer();
       done();
    });
    
    describe('GET /', function() {
        it('returns status code 404', function() {
            request.get(base_url, function(err, response, body) {
                if(err) return done(err);
                assert.equal(404, response.statusCode);
                done();
            });
        });
    });
    
    describe('GET /track', function() {
        it('returns status code 200', function() {
            request.get(track_url, function(err, response, body) {
                if(err) return done(err);
                assert.equal(200, response.statusCode);
                done();
            });
        });
        it('returns empty JSON string', function() {
            request.get(track_url, function(err, response, body) {
                if(err) return done(err);
                assert.equal(JSON.stringify({}), body);
                done();
            });
        });
    });
    describe('GET /track with query parameters', function() {
        var client;
        
        before(function(done){
            client =  redis.createClient();
            done();
        });
        
        after(function(done) {
            fs.unlinkSync(file);
            client.quit();
            done();
        });

        beforeEach(function(done) {
            fs.writeFileSync(file, '');
            client.set("count", 0, done);
        });
        
        it('returns query as JSON string', function(done) {
            request.get(track_url+query, function(err, response, body) {
                if(err) return done(err);
                assert.equal(JSON.stringify(queryObj), body);
                done();
            });
        });
        it('save parameters to JSON file', function(done){
            request.get(track_url+query, function(err, response, body) {
                if(err) return done(err);
                fs.readFile(file, 'utf8', function(err, data) {
                    if(err) return done(err);
                    assert.equal(JSON.stringify(queryObj)+'\n', data);
                    done();
                })
            });
            
        });
        it('increment "count" in redis database', function(done){
            request.get(track_url+query, function(err, response, body) {
                if(err) return done(err);
                client.get('count', function(err, rep){
                    if(err) return done(err);
                    assert.equal(rep, queryObj["count"]);
                    done();
                });
            });
            
        })
  });
});