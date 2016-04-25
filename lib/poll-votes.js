const _ = require('lodash')

var pollVotes = function (channel, incommingPoll, socket, app, io){
  if(channel === "voteCast"){
    var pollId = incommingPoll.pollId
    if(app.locals.allPolls[pollId]['pollInfo']['active']){
       app.locals.allPolls[pollId]['votes'][socket.id] = incommingPoll.vote
     };
    var individualPollChannel = app.locals.allPolls[pollId]['pollId']
    var organizedPoll = organizePoll(app.locals.allPolls[pollId]['votes'])
    io.sockets.emit(individualPollChannel, organizedPoll)
  };
};

function organizePoll(uglyPoll){
  var goodLookingPoll = _.invertBy(uglyPoll);
  return goodLookingPoll
};

module.exports = pollVotes;
