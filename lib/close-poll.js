module.exports = function closePoll(channel, pollId, app, io){
  if(channel === "close-poll"){
    app.locals.allPolls[pollId]['pollInfo']['active'] = false
    io.sockets.emit("pollEnded", {})
  }
};
