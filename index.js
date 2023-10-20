const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let waitingUser = null;
let channelCounter = 1;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  if (waitingUser) {
    let channelName = 'channel-' + channelCounter;
    socket.join(channelName);
    waitingUser.join(channelName);

    console.log(
      `Users ${waitingUser.id} and ${socket.id} joined ${channelName}`
    );

    waitingUser = null;
    channelCounter++;
  } else {
    waitingUser = socket;
  }

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
