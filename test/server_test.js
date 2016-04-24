const assert = require('assert');
const request = require('request');
const app = require('../server');
const crypto = require('crypto');

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
    beforeEach(() => {
      var id = crypto.randomBytes(10).toString('hex');
        app.locals.polls = { }
      });
    it('should return a 200', (done) => {
      // [id] = { "pole" : 3 }
      this.request.get('/polls/' + id, (error, response) => {
          if(error){ done(error); }
          console.log(response.body)
          assert.equal(response.statusCode, 200);
          done();
      });
    });
  });
});
