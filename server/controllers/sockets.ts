import { Socket, Server } from 'socket.io';
import {
  dealCards,
  PlayerCard,
  TaskCard,
  sortHandOfCards,
  TaskOptions,
  dealTaskCards,
} from './cards';
interface CustomSocket extends Socket {
  username?: string;
}
export let activeSockets: CustomSocket[] = [];

export function socketCommunication(socket: CustomSocket, io: Server): void {
  activeSockets = [...activeSockets, socket];

  socket.on(
    'update_player_name',
    (params: { username: string; id: string }) => {
      const currentSocket = activeSockets.find(
        (socket) => socket.id === params.id
      );
      if (!currentSocket) return;
      currentSocket.username = params.username;
      io.to(params.id).emit('player_name_updated');
    }
  );
  socket.on('deal_cards', () => {
    const dealtCards = dealCards(activeSockets.length);
    const playersInGame = activeSockets.map((socket, idx) => {
      return {
        socket: socket.id,
        playerPosition: idx + 1,
        username: socket.username,
        tricks: 0,
      };
    });
    playersInGame.forEach((player) => {
      const playersCards: PlayerCard[] = sortHandOfCards(
        dealtCards[player.playerPosition]
      ).map((card) => {
        return {
          ...card,
          username: player.username,
        };
      });
      io.to(player.socket).emit('dealt_cards', {
        player,
        playersCards,
        playersInGame,
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

  socket.on('move_card', (data: { card: PlayerCard; sendToSocket: string }) => {
    io.to(data.sendToSocket).emit('recieve_players_card', data.card);
  });

  socket.on('disconnect', () => {
    activeSockets = activeSockets.filter(
      (activeSocket) => activeSocket.id !== socket.id
    );
  });
}
