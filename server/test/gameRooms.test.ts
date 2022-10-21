import { expect } from 'chai';
import GameRooms from '../storage/rooms';

describe('GameRooms', () => {
  it('adds a new room', () => {
    const roomName = 'new room';
    const code = 'game code';
    GameRooms.addNewRoom(roomName, code);
    expect(GameRooms.roomNames[0]).to.equal(roomName);
    expect(GameRooms.getRoomCode(roomName)).to.equal(code);
  });
});
