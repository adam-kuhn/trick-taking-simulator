import { Socket, Server } from 'socket.io';
import {
  dealCards,
  PlayerCard,
  sortHandOfCards,
  TaskOptions,
  dealTaskCards,
} from './cards';

let activeSockets: Socket[] = [];

export function socketCommunication(socket: Socket, io: Server): void {
  activeSockets = [...activeSockets, socket];

  socket.on('deal_cards', () => {
    const dealtCards = dealCards(activeSockets.length);
    activeSockets.forEach((socket, idx) => {
      const player = idx + 1;
      const playersCards = sortHandOfCards(dealtCards[player]);
      io.to(socket.id).emit('dealt_cards', {
        player,
        playersCards,
        numberOfPlayers: activeSockets.length,
      });
    });
  });

  socket.on('deal_task_cards', (options: TaskOptions) => {
    const { numberOfTasks, revealOnlyToCommander } = options;
    const taskCards = dealTaskCards(numberOfTasks);
    io.emit('show_task_cards', {
      taskCards,
      revealOnlyToCommander,
    });
  });

  socket.on('played_card', (card: PlayerCard) => {
    socket.broadcast.emit('played_card', card);
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (activeSocket) => activeSocket.id !== socket.id
    );
  });
}
