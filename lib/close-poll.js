module.exports = function closePoll(channel, pollId, app, io){
  app.locals.allPolls[pollId]['pollInfo']['active'] = false
  io.sockets.emit("pollEnded", {})
};
