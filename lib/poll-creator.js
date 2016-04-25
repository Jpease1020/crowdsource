const crypto = require('crypto');

var createNewPoll = function (channel, message, socket, app){
  if(channel === 'createNewPoll'){
  var randomId = crypto.randomBytes(10).toString('hex');
  var urls = createUrls(randomId);
  var newPoll = {}

  newPoll.pollId = randomId
  newPoll.pollUrls = urls
  newPoll.pollInfo = message
  newPoll.votes = {}
  app.locals.allPolls[randomId] = newPoll
  app.locals.activePolls.push(newPoll)
  socket.emit('newPoll', newPoll)
  };
};

function createUrls(randomId){
  return {adminUrl: 'polls/' + randomId,
          userUrl: 'vote/' + randomId,
          }
};

module.exports = createNewPoll
