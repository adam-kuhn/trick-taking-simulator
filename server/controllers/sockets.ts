import { Socket, Server } from 'socket.io';
import { dealCards } from './cards';

let activeSockets: Socket[] = [];

export function socketCommunication(socket: Socket, io: Server): void {
  activeSockets = [...activeSockets, socket];

  socket.on('deal_cards', () => {
    const dealtCards = dealCards(activeSockets.length);
    activeSockets.forEach((socket, idx) => {
      io.to(socket.id).emit('dealt_cards', dealtCards[`${idx + 1}`]);
    });
  });

  socket.on('message', (data) => {
    console.log('MESAGE recieved', data);
    socket.emit('broadcast_message', `${data} modified from BE`);
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (activeSocket) => activeSocket.id !== socket.id
    );
  });
}
