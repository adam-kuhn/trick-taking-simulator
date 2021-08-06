import { TestBed } from '@angular/core/testing';
import { GameState } from '../types/game';

import { SharedGameStateService } from './shared-game-state.service';

const userPlayer = {
  playerPosition: 1,
  socket: 'socket-1',
  username: 'User Player',
  tricks: 0,
};
const playerInPositionTwo = {
  playerPosition: 2,
  socket: 'socket-2',
  username: 'User 2',
  tricks: 0,
};
const playerInPositionThree = {
  playerPosition: 3,
  socket: 'socket-3',
  username: 'User 3',
  tricks: 0,
};
const playerInPositionFour = {
  playerPosition: 4,
  socket: 'socket-4',
  username: 'User 4',
  tricks: 0,
};
const playerInPositionFive = {
  playerPosition: 5,
  socket: 'socket-5',
  username: 'User 5',
  tricks: 0,
};

const initialData: GameState = {
  playersInGame: [
    userPlayer,
    playerInPositionTwo,
    playerInPositionThree,
    playerInPositionFour,
    playerInPositionFive,
  ],
  player: { ...userPlayer },
  playersCards: [],
};

describe('SharedGameStateService', () => {
  let service: SharedGameStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedGameStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('Updates last hand information on a completed trick - current player wins', () => {
    const winningCard = {
      value: 5,
      suit: 'green',
      playerPosition: userPlayer.playerPosition,
      username: userPlayer.username,
    };
    const cardInTrick = {
      value: 1,
      suit: 'blue',
      playerPosition: playerInPositionTwo.playerPosition,
      username: playerInPositionTwo.username,
    };
    const cardInTrickTwo = {
      value: 1,
      suit: 'green',
      playerPosition: playerInPositionTwo.playerPosition,
      username: playerInPositionTwo.username,
    };
    service.handleStartingCards(initialData);
    const trick = [winningCard, cardInTrick, cardInTrickTwo];
    service.completedTrick(trick, winningCard);
    expect(service.winningCard).toEqual(winningCard);
    expect(service.lastTrick).toEqual(trick);
    expect(service.player?.tricks).toEqual(1);
  });
  it('Updates last hand information on a completed trick - other player wins', () => {
    const winningCard = {
      value: 5,
      suit: 'green',
      playerPosition: playerInPositionTwo.playerPosition,
      username: playerInPositionTwo.username,
    };
    const cardInTrick = {
      value: 1,
      suit: 'blue',
      playerPosition: userPlayer.playerPosition,
      username: userPlayer.username,
    };
    const cardInTrickTwo = {
      value: 1,
      suit: 'green',
      playerPosition: playerInPositionTwo.playerPosition,
      username: playerInPositionTwo.username,
    };
    service.handleStartingCards(initialData);
    const trick = [winningCard, cardInTrick, cardInTrickTwo];
    service.completedTrick(trick, winningCard);
    const winningPlayer = service.playerSummary.find(
      (player) => player.playerPosition === playerInPositionTwo.playerPosition
    );
    expect(service.winningCard).toEqual(winningCard);
    expect(service.lastTrick).toEqual(trick);
    expect(winningPlayer?.tricks).toEqual(1);
  });

  it('Finds the player to the left of user', () => {
    service.handleStartingCards(initialData);
    const actual = service.playerToTheLeft;
    expect(actual).toEqual(playerInPositionTwo);
  });

  it('Finds the player to the right of user', () => {
    service.handleStartingCards(initialData);
    const actual = service.playerToTheRight;
    expect(actual).toEqual(playerInPositionFive);
  });

  it('Finds the player two to the right of user', () => {
    service.handleStartingCards(initialData);
    const actual = service.playerThreeToTheRight;
    expect(actual).toEqual(playerInPositionFour);
  });

  it('Finds the player two to the left of user', () => {
    service.handleStartingCards(initialData);
    const actual = service.playerTwoToTheLeft;
    expect(actual).toEqual(playerInPositionThree);
  });
});
