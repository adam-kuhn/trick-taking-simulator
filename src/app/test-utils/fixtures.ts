import { Player } from '../types/game';

export const createPlayerFixture = (options?: Partial<Player>): Player => {
  return {
    socket: 'socket-id',
    playerPosition: 1,
    username: 'joe',
    tricks: 0,
    ...options,
  };
};
