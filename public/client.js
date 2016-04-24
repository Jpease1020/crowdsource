var socket = io();
var connectionCount = document.getElementById('connection-count');

socket.on('usersConnected', function (count) {
  console.log(count)
});

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
  var $pollDuration = $('.close-poll-time').val()
  var $pollName = $('#poll-name').val();
  var newPollInfo = { pollName: $pollName,
                      pollOptions: {},
                      startTime: Date.now(),
                      pollDuration: parseInt($pollDuration),
                      active: true
                    };

  var options = $('.option').map(function(index, element) {
    newPollInfo.pollOptions['option' + (index + 1)] = $(element).val()
  });
  socket.send('createNewPoll', newPollInfo);
});

var $newPollLinks = $('.new-poll-links')
var $closePollDiv = $('#close-poll-button')
socket.on('newPoll', function(poll){
  $('.new-poll-links').children().remove()
  $newPollLinks.append("<div>This link will shows the poll results as they come in: <a href=" +
                        poll.pollUrls.adminUrl + ">Public Poll/Voting Page</a></div>")
  $newPollLinks.append('<div>Send this link to your voters for a private vote: <a href=' +
                        poll.pollUrls.userUrl +
                       '>Private Voting Page</a></div>')
  $closePollDiv.append('<button class="close-poll" id="' + poll.pollUrls.adminUrl + '">Close the Poll</buttton>')
});

var $choices = document.querySelectorAll('.poll-choices button');
var $pollId = $('.poll-id').html()
for (var i = 0; i < $choices.length; i++) {
  $choices[i].addEventListener('click', function () {
    var message = {pollId: $pollId, vote: this.innerText}
    socket.send('voteCast', message);
    $('#your-vote').html(this.innerText)
  });
};

socket.on($pollId, function(votes){
  $('.all-votes').children().remove()
  for(var vote in votes){
    $('.all-votes').append('<div>' + vote + ': ' + votes[vote].length + '</div>')
  }
});

socket.on("pollEnded", function(){
  $('.poll-choices').children().remove()
  $('.poll-choices').append(
    '<h2>thanks for playing but the poll is now closed</h2>'
    )
});

$('#close-poll-button').delegate('.close-poll', 'click', function(){
  var url = $('.close-poll').attr('id')
  var id = url.substring(6, url.length)
  socket.send("close-poll", id)
});
