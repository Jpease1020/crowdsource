const http = require('http');
const express = require('express');
const app = express();
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
// app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use(express.static('public'));

app.get('/', function (req, res){
  res.sendFile(__dirname + '/public/index.html');
});

var votes = {}
var polls = {}

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
    // create new links
  var urls = createUrls();
  polls[urls.id] = urls
  polls[urls.id].vote = {}
  console.log(polls)
  };
};

function createUrls(){
  var id = crypto.randomBytes(10).toString('hex');
  console.log(id)
  var adminUrl = 'polls/' + id
  var userUrl  = 'vote/' + id
  var groupVoteUrl = 'group-vote/' + id
  return { id: id,
          adminUrl: adminUrl,
          userUrl: userUrl,
          groupVoteUrl: groupVoteUrl
          }
};

module.exports = server;
