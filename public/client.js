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
  var newPollInfo = { pollName: $pollName };

  var options = $('.option').map(function(index, element) {
    newPollInfo['option' + (index + 1)] = $(element).val()
  });
  socket.send('newPoll', newPollInfo);
});

var $newPollLinks = $('.new-poll-links')

socket.on('newPoll', function(poll){
  $newPollLinks.append('<div>This page is for contrrolling the poll: <a href="' +
                        poll.pollUrls.adminUrl + '">admin page</a></div>')
  $newPollLinks.append('<div>Share this page for users to vote privately: <a href="' +
                        poll.pollUrls.userUrl +
                       '">private voting page</a></div>')
  $newPollLinks.append('<div>Share this link to allow users to vote publically: <a href="' +
                        poll.pollUrls.groupVoteUrl +
                        '">group voting page</a></div>')
  console.log(poll)
});



// for (var i = 0; i < buttons.length; i++) {
//   buttons[i].addEventListener('click', function () {
//     console.log(this.innerText)
//     socket.send('voteCast', this.innerText);
//     var yourVote = document.getElementById('your-vote')
//     yourVote.innerText = this.innerText
//   });
// };
