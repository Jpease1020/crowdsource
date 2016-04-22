const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs')
const crypto = require('crypto');
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

var polls = {}

app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

app.get("/polls/:id", function(req, res){
  var poll = polls[req.params.id]
  res.render('polls', { poll: poll });
});

app.get("/vote/:id", function(req, res){
  console.log("heeyyeyeyeyeyeyeye")
  console.log(req.params.id)
  console.log(polls)
  var poll = polls[req.params.id]
  res.render('vote', { poll: poll });
});

app.get("/group-vote/:id", function(req, res){
  console.log("heeyyeyeyeyeyeyeye")
  console.log(req.params.id)
  console.log(polls)
  var poll = polls[req.params.id]
  res.render('group-vote', { poll: poll });
});

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    pollVotes(channel, message, socket)
    createNewPoll(channel, message, socket)
    // console.log(votes)
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });
});

function pollVotes(channel, message, socket){
  if(channel === "voteCast"){
    votes[socket.id] = message
  };
};

function createNewPoll(channel, message, socket){
  if(channel === 'newPoll'){
  var id = crypto.randomBytes(10).toString('hex');
  var urls = createUrls(id);
  var yourNewPoll = {}

  yourNewPoll.pollId = id
  yourNewPoll.pollUrls = urls
  yourNewPoll.poll = message
  yourNewPoll.votes = {}
  console.log(yourNewPoll)

  polls[id] = yourNewPoll
  socket.emit('newPoll', yourNewPoll)
  };
};

function createUrls(id){
  var adminUrl = 'polls/' + id
  var userUrl  = 'vote/' + id
  var groupVoteUrl = 'group-vote/' + id
  return {adminUrl: adminUrl,
          userUrl: userUrl,
          groupVoteUrl: groupVoteUrl
          }
};

module.exports = server;
