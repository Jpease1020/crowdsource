const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs')
const _ = require('lodash')
const crypto = require('crypto');
const port = process.env.PORT || 3000;
const server = http.createServer(app)
                   .listen(port, function () {
  // console.log('Listening on port ' + port + '.');
});
const socketIo = require('socket.io');
const io = socketIo(server);

if (!module.parent) {
  app.listen(app.get('port'), () => {
    // console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}


var polls = {}
var activePolls = []

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res){
  res.render('index');
});

app.get("/polls/:id", function(req, res){
  var poll = polls[req.params.id]
  console.log(poll)
  res.render('polls', { poll: poll });
});

app.get("/vote/:id", function(req, res){
  var poll = polls[req.params.id]
  res.render('vote', { poll: poll });
});


io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    createNewPoll(channel, message, socket);
    pollVotes(channel, message, socket);
    closePoll(channel, message);
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });

});

function createNewPoll(channel, message, socket){
  if(channel === 'createNewPoll'){
  var id = crypto.randomBytes(10).toString('hex');
  var urls = createUrls(id);
  var newPoll = {}

  newPoll.pollId = id
  newPoll.pollUrls = urls
  newPoll.pollInfo = message
  newPoll.votes = {}

  polls[id] = newPoll
  activePolls.push(newPoll)
  socket.emit('newPoll', newPoll)
  };
};

function createUrls(id){
  var adminUrl = 'polls/' + id
  var userUrl  = 'vote/' + id
  return {adminUrl: adminUrl,
          userUrl: userUrl,
          }
};

function pollVotes(channel, message, socket){
  if(channel === "voteCast"){
    if(polls[message.pollId]['pollInfo']['active']){
       polls[message.pollId]['votes'][socket.id] = message.vote
     };
    var individualPollChannel = polls[message.pollId]['pollId']
    var organizedPoll = organizePoll(polls[message.pollId]['votes'])
    io.sockets.emit(individualPollChannel, organizedPoll)
  };
};

function organizePoll(poll){
  var goodLookingPoll = _.invertBy(poll);
  return goodLookingPoll
};

function closePoll(channel, pollId){
  if(channel === "close-poll"){
    polls[pollId]['pollInfo']['active'] = false
    io.sockets.emit("pollEnded", {})
  }
};

setInterval(function() {
    for(var i = 0; i <= activePolls.length -1; i++){
      var pollInfo = activePolls[i]['pollInfo']
      var pollDuration = pollInfo['pollDuration'] || 1440
      var pollEndTime = pollInfo['startTime'] + (pollDuration * 60000)
      if(pollEndTime < Date.now()){
        pollInfo['active'] = false
        activePolls.splice(activePolls.indexOf(activePolls[i]), 1)
        io.sockets.emit("pollEnded", {})
      };
    };
}, 1000);

module.exports = server;
