const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs')
const _ = require('lodash')
const createNewPoll = require('./lib/poll-creator')

const port = process.env.PORT || 3000;
const server = http.createServer(app)
                   .listen(port, function () {
  console.log('Listening on port ' + port + '.');
});

if (!module.parent) {
  app.listen(app.get('port'), () => {
    console.log(`${app.locals.title} is running on ${app.get('port')}.`);
  });
}

const socketIo = require('socket.io');
const io = socketIo(server);

app.use(express.static('public'));
app.set('view engine', 'ejs')


app.get('/', function (req, res){
  res.render('index');
});

app.get("/polls/:id", function(req, res){
  res.render('polls', { poll: getPollByParamsId(req) });
});

app.get("/vote/:id", function(req, res){
  res.render('vote', { poll: getPollByParamsId(req) });
});

function getPollByParamsId(req){
  return app.locals.allPolls[req.params.id]
};

app.locals.allPolls = {}
app.locals.activePolls = []

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    createNewPoll(channel, message, socket, app);
    pollVotes(channel, message, socket);
    closePoll(channel, message);
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });
});


function pollVotes(channel, incommingPoll, socket){
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

function closePoll(channel, pollId){
  if(channel === "close-poll"){
    app.locals.allPolls[pollId]['pollInfo']['active'] = false
    io.sockets.emit("pollEnded", {})
  }
};

setInterval(function() {
    for(var i = 0; i <= app.locals.activePolls.length -1; i++){
      var pollInfo = app.locals.activePolls[i]['pollInfo']
      var pollDuration = pollInfo['pollDuration'] || 1440
      var pollEndTime = pollInfo['startTime'] + (pollDuration * 60000)
      if(pollEndTime < Date.now()){
        pollInfo['active'] = false
        app.locals.activePolls.splice(app.locals.activePolls.indexOf(app.locals.activePolls[i]), 1)
        io.sockets.emit("pollEnded", {})
      };
    };
}, 1000);

module.exports = app;
