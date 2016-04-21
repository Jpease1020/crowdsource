var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  console.log(count)
});

var buttons = document.querySelectorAll('#choices button');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    console.log(this.innerText)
    socket.send('voteCast', this.innerText);
    var yourVote = document.getElementById('your-vote')
    yourVote.innerText = this.innerText
  });
};
