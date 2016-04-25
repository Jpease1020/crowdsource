const assert = require('assert');
const request = require('request');
const app = require('../server');
const crypto = require('crypto');
const fixtures = require('./fixtures');

describe('Server', () => {

  before((done) => {
    this.port = 9876;
    this.server = app.listen(this.port, (err, result) => {
      if (err) { return done(err); }
      done();
    });

    this.request = request.defaults({
      baseUrl: 'http://localhost:9876/'
    });
  });

  after(() => {
    this.server.close();
  });

  it('should exist', () => {
    assert(app);
  });

  describe('GET /', () => {
    it('should return a 200', (done) => {
      this.request.get('/', (error, response) => {
        if (error) { done(error); }
        assert.equal(response.statusCode, 200);
        done();
      });
    });
  });

  describe('GET /polls/:id', (done) => {
    var testPoll = fixtures.validPoll
    app.locals.allPolls[testPoll.pollId] = testPoll
    var id = testPoll.pollId

    it('should not return a 404', (done) => {
      this.request.get('/polls/' + id, (error, response) => {
          if(error){ done(error); }
          assert.notEqual(response.statusCode, 404);
          done();
      });
    });
  });

  describe('GET /vote/:id', (done) => {
    it('should not return a 404', (done) => {
      var testPoll = fixtures.validPoll
      var id = testPoll.pollId
      app.locals.allPolls[testPoll.pollId] = testPoll
      this.request.get('/vote/' + id, (error, response) => {
          if(error){ done(error); }
          assert.notEqual(response.statusCode, 404);
          done();
      });
    });
  });
});
