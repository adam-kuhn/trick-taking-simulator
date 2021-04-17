import { PlayerDisplayNamePipe } from './player-display-name.pipe';

describe('PlayerDisplayNamePipe', () => {
  it('Displays the players username when provided', () => {
    const pipe = new PlayerDisplayNamePipe();
    const expectedUsername = 'Custom Username';
    const player = {
      playerPosition: 1,
      username: expectedUsername,
      socket: 'web-socket',
      tricks: 0,
    };
    const actualUsername = pipe.transform(player);
    expect(actualUsername).toBe(expectedUsername);
  });
  it('Displays the players position when no username is provided', () => {
    const pipe = new PlayerDisplayNamePipe();
    const player = {
      playerPosition: 1,
      username: '',
      socket: 'web-socket',
      tricks: 0,
    };
    const expected = 'Player 1';
    const actual = pipe.transform(player);
    expect(actual).toBe(expected);
  });
});
