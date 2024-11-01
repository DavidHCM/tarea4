import express from 'express';
import {Server} from 'socket.io';
import { config } from 'dotenv';
const path = require('path');

config();
declare module 'socket.io' {
  interface Socket {
    username?: string;
    roomName?: string;
  }
}


import routes from './routers/index';


const app = express();
const port = process.env.PORT || 3000;

app.use('/public', express.static(path.join(__dirname, '..','public')));

app.use(express.json());
app.use(routes);


const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const io = new Server(server);

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('joinRoom', ({ room, user }) => {
    const roomName = 'room-' + room;
    socket.join(roomName);
    socket.username = user;
    socket.roomName = roomName;

    socket.to(roomName).emit('userConnected', `${user} se ha conectado`);
  });

  socket.on('sendMessage', (data) => {
    const roomName = 'room-' + data.room;
    console.log("Recibiste un mensaje: ", data);
    socket.to(roomName).emit('getMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');

    const roomName = socket.roomName;

    if (roomName) {
      socket.to(roomName).emit('userDisconnected', `${socket.username} se ha desconectado`);
    }
  });
});