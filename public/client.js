var socket = io();
var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  console.log(count)
});

// var buttons = document.querySelectorAll('#choices button');
var $optionsContainer = $('.poll-options');
var $addOption = $('.add-option');
var $removeOption = $('.remove-option');

$addOption.on('click', function(event){
  event.preventDefault();
  $optionsContainer.append('<input class="option" type="text" placeholder="poll option"></input>')
});

$removeOption.on('click', function(event){
  event.preventDefault();
  $('.option').last().remove()
});

$('.submit-poll').on('click', function(){
  event.preventDefault();
  var $pollName = $('#poll-name').val();
  var newPollInfo = { pollName: $pollName,
                      pollOptions: {}
                    };

  var options = $('.option').map(function(index, element) {
    newPollInfo.pollOptions['option' + (index + 1)] = $(element).val()
  });
  socket.send('createNewPoll', newPollInfo);
});

var $newPollLinks = $('.new-poll-links')

socket.on('newPoll', function(poll){
  $newPollLinks.append('<div>This page is for controlling the poll: <a href="' +
                        poll.pollUrls.adminUrl + '">admin page</a></div>')
  $newPollLinks.append('<div>Share this page for users to vote privately: <a href="' +
                        poll.pollUrls.userUrl +
                       '">private voting page</a></div>')
  console.log(poll)
});

var $choices = document.querySelectorAll('.poll-choices button');
var pollId = $('.poll-id').html()
for (var i = 0; i < $choices.length; i++) {
  $choices[i].addEventListener('click', function () {
    // $('.vote-cast').css("background-color:red")
    // console.log(this.innerText)
    // this.css('background-color:blue')
    var message = {pollId: pollId, vote: this.innerText}
    socket.send('voteCast', message);
    // var yourVote = document.getElementById('your-vote')
    // yourVote.innerText = this.innerText
  });
};
