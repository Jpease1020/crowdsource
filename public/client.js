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
  //
  // collect the input info
  // send the info to server
  // server side make new urls
  // make a new poll object and add to poll store object
  // new poll object should have the urls and the poll
  // make a new poll page
  // send the new urls back to the client
