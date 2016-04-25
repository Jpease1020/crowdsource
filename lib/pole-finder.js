module.exports = function (req, app){
  return app.locals.allPolls[req.params.id]
};
