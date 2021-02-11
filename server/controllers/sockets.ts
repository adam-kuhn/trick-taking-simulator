import { Socket, Server } from 'socket.io';
import {
  dealCards,
  PlayerCard,
  TaskCard,
  sortHandOfCards,
  TaskOptions,
  dealTaskCards,
} from './cards';

export let activeSockets: Socket[] = [];

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
    const { revealOnlyToCommander } = options;
    const taskCards = dealTaskCards(options);
    io.emit('show_task_cards', {
      taskCards,
      revealOnlyToCommander,
    });
  });

  socket.on('played_card', (card: PlayerCard) => {
    socket.broadcast.emit('played_card', card);
  });

  socket.on('assign_task', (card: TaskCard) => {
    socket.broadcast.emit('assign_task', card);
  });

  socket.on('complete_task', (card: TaskCard) => {
    socket.broadcast.emit('complete_task', card);
  });

  socket.on('reveal_tasks', () => {
    socket.broadcast.emit('reveal_tasks');
  });

  socket.on('communicate', (data: { type: string; card: PlayerCard }) => {
    io.emit('communicate', data);
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (activeSocket) => activeSocket.id !== socket.id
    );
  });
}
