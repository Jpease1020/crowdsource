const http = require('http');
const express = require('express');
const app = express();
const ejs = require('ejs')

const createNewPoll = require('./lib/poll-creator')
const getPollByParamsId = require('./lib/pole-finder')
const pollVotes = require('./lib/poll-votes')
const closePoll = require('./lib/close-poll')
const checkForClosedPolls = require('./lib/check-for-closed-polls')

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
  res.render('polls', { poll: getPollByParamsId(req, app) });
});

app.get("/vote/:id", function(req, res){
  res.render('vote', { poll: getPollByParamsId(req, app) });
});

app.locals.allPolls = {}
app.locals.activePolls = []

io.on('connection', function (socket) {
  console.log('A user has connected.', io.engine.clientsCount);

  io.sockets.emit('usersConnected', io.engine.clientsCount);
  socket.emit('statusMessage', 'You have connected.');

  socket.on('message', function (channel, message) {
    if (channel === 'createNewPoll') {
      createNewPoll(message, socket, app);
    } else if (channel === 'voteCast') {
      pollVotes(message, socket, app, io);
    } else {
      closePoll(channel, message, app, io);
    }
  });

  socket.on('disconnect', function () {
    console.log('A user has disconnected.', io.engine.clientsCount);
  });
});

checkForClosedPolls(app, io)

module.exports = app;
