const socketIO = require('socket.io');
const { events } = require('./constant');

let io;
function socketManager(server) {
  if (!server.app) server.app = {};
  io = socketIO(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  io.on(events.connect, (client) => {
    try {
      console.log('user connected successfully');
      // Event listener for socket disconnection
      client.on(events.disconnect, () => {
        console.log('user disconnected');
      });
    } catch (error) {
      console.log(error);
    }
  });
}

function broadcastEvent(event, data) {
  io.sockets.emit(event, data);
}

module.exports = {
  socketManager,
  broadcastEvent,
};
