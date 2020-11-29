import { Socket, Server } from 'socket.io';
import { dealCards, Card } from './cards';

let activeSockets: Socket[] = [];

export function socketCommunication(socket: Socket, io: Server): void {
  activeSockets = [...activeSockets, socket];

  socket.on('deal_cards', () => {
    const dealtCards = dealCards(activeSockets.length);
    activeSockets.forEach((socket, idx) => {
      const player = idx + 1;
      io.to(socket.id).emit('dealt_cards', {
        player,
        playersCards: dealtCards[player],
        numberOfPlayers: activeSockets.length,
      });
    });
  });

  socket.on('played_card', (card: Card) => {
    socket.broadcast.emit('played_card', card);
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (activeSocket) => activeSocket.id !== socket.id
    );
  });
}
