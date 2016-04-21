var socket = io();

var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  console.log(count)
});

var buttons = document.querySelectorAll('#choices button');
var $optionsContainer = $('.poll-options');

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function () {
    console.log(this.innerText)
    socket.send('voteCast', this.innerText);
    var yourVote = document.getElementById('your-vote')
    yourVote.innerText = this.innerText
  });
};

$('.add-option').on('click', function(event){
  event.preventDefault();
  $optionsContainer.append('<input class="option" type="text" placeholder="poll option"></input>')
});

$('.remove-option').on('click', function(event){
  event.preventDefault();
  $('.option').last().remove()
});

$('.create-new-poll').on('click', function(){
  var $pollName = $('#poll-name').val()
  var $option1 = $('#option-1').val()
  var $option2 = $('#option-2').val()
  var $option3 = $('#option-3').val()
  var newPollInfo = {pollName: $pollName,
                     option1: $option1,
                     option2: $option2,
                     option3: $option3,
                   };
  socket.send('newPoll', newPollInfo);
  // collect the input info
  // send the info to server
  // server side make new urls
  // make a new poll object and add to poll store object
  // new poll object should have the urls and the poll
  // make a new poll page
  // send the new urls back to the client
});
