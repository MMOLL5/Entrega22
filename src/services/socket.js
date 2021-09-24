import socketIo from 'socket.io';
import { formatMessages } from '../utils/messages';
import fs from 'fs';
import { Mensajes } from '../models/mensajes/DAOs/mongo';


const data = {
  username: undefined,
  text: undefined,
  time: undefined
};

export const initWsServer = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Nueva Conexion establecida!');

    //Listen for chat messages
    socket.on('chatMessage', (msg, userName) => {
      data.username = userName;
      data.text = msg;
      data.time = new Date();

      Mensajes.add(data)
        .then((data) => console.log(data))
        .catch((err) => {
          console.log(err.message);
        });
      io.emit('message', formatMessages(data));
    });
  });

  return io;
};