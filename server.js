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
  res.sendFile(__dirname + '/public/index.html');
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
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });
});

function createNewPoll(channel, message, socket){
  if(channel === 'createNewPoll'){
  var id = crypto.randomBytes(10).toString('hex');
  var urls = createUrls(id);
  var yourNewPoll = {}

  yourNewPoll.pollId = id
  yourNewPoll.pollUrls = urls
  yourNewPoll.pollInfo = message
  yourNewPoll.votes = {}

  polls[id] = yourNewPoll
  activePolls.push(yourNewPoll)
  socket.emit('newPoll', yourNewPoll)
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
    polls[message.pollId]['votes'][socket.id] = message.vote
    console.log(polls)
    var individualPollChannel = polls[message.pollId]['pollId']
    var organizedPoll = organizePoll(polls[message.pollId]['votes'])
    io.sockets.emit(individualPollChannel, organizedPoll)
  };
};

function organizePoll(poll){
  var goodLookingPoll = _.invertBy(poll);
  return goodLookingPoll
};

  setInterval(function() {
    if(activePolls.length >= 1){
      console.log(activePolls)
      for(var i = 0; i <= activePolls.length -1; i++){
        var pollInfo = activePolls[i]['pollInfo']
        var pollEndTime = pollInfo['startTime'] + (pollInfo['pollDuration'] * 60000)
        if(pollEndTime < Date.now()){
          console.log(Date.now())
          console.log(pollEndTime)
          pollInfo['active'] = false
          activePolls.splice(activePolls.indexOf(activePolls[i]), 1)
          console.log(activePolls)
        };
      };
    };
  }, 10000);

module.exports = server;
