var checkForClosedPolls = function (app, io){
  setInterval(function() {
      for(var i = 0; i <= app.locals.activePolls.length -1; i++){
        var pollInfo = app.locals.activePolls[i]['pollInfo']
        var pollDuration = pollInfo['pollDuration'] || 1440
        var pollEndTime = pollInfo['startTime'] + (pollDuration * 60000)
        if(pollEndTime < Date.now()){
          pollInfo['active'] = false
          app.locals.activePolls.splice(app.locals.activePolls.indexOf(app.locals.activePolls[i]), 1)
          io.sockets.emit("pollEnded", {})
        };
      };
  }, 1000);
}

module.exports = checkForClosedPolls;
