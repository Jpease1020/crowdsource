const assert = require('assert');
const refute = require("refute")(assert);
const request = require('request');
const app = require('../server');
const crypto = require('crypto');
const fixtures = require('./fixtures');
const validTestPoll = fixtures.validPoll
const closedTestPoll = fixtures.closedPoll

describe('Private Voting Page', () => {

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

  describe('Private voting page', (done) => {
    app.locals.allPolls[validTestPoll.pollId] = validTestPoll
    var id = validTestPoll.pollId
    it('should have the title of the poll', (done) => {
      this.request.get('/vote/' + id, (error, response) => {
          if(error){ done(error); }
          assert(response.body.includes(validTestPoll['pollInfo']['pollName']),
               `"${response.body}" does not include "Do you think Regis is Sant Claus?".`);
          done();
      });
    });

    it('should have the voting options of the poll', (done) => {
      this.request.get('/vote/' + id, (error, response) => {
          if(error){ done(error); }
          console.log(response.body)
          assert(response.body.includes('Of course!'),
               `"${response.body}" does not include Of Course!.`);
          done();
      });
    });
  });

  describe('Vote page for a closed poll', (done) => {
    var testPoll = fixtures.validPoll
    app.locals.allPolls[testPoll.pollId] = testPoll
    var id = testPoll.pollId

    it('should not have the voting options of the poll', (done) => {
      testPoll.pollInfo.active = false
      this.request.get('/vote/' + id, (error, response) => {
        if(error){ done(error); }
        refute(response.body.includes("I'm too drunk right now"),
              `"${response.body}" does include "I'm too drunk right now".`);
          done();
      });
    });
  });
});
