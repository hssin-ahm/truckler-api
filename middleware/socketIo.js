const socketio = (socket) => async (req, res, next) => {
  req.io = socket;
  next();
};

module.exports = socketio;
