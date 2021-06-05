import { TestBed } from '@angular/core/testing';
import { Communication, GameState } from '../types/game';

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
  player: userPlayer,
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
  it('Adds revealed communication cards', () => {
    const communicationOne: Communication = {
      type: 'highest',
      card: { value: 1, suit: 'green', playerPosition: 1, username: 'User 1' },
    };
    const communicationTwo: Communication = {
      type: 'highest',
      card: { value: 5, suit: 'yellow', playerPosition: 2, username: 'User 2' },
    };
    service.updateRevealedCommunication(communicationOne);
    service.updateRevealedCommunication(communicationTwo);
    const actual = service.revealedCommunications;
    expect(actual.length).toEqual(2);
    expect(actual[0]).toEqual(communicationOne);
    expect(actual[1]).toEqual(communicationTwo);
  });

  it('Updates the type of Communication if card is already revealed', () => {
    const communicationOne: Communication = {
      type: 'highest',
      card: { value: 1, suit: 'green', playerPosition: 1, username: 'User 1' },
    };
    service.updateRevealedCommunication(communicationOne);
    service.updateRevealedCommunication({
      ...communicationOne,
      type: 'lowest',
    });
    const actual = service.revealedCommunications;
    expect(actual.length).toEqual(1);
    expect(actual[0].type).toEqual('lowest');
  });

  it('Removes communication cards when they are played', () => {
    const card = {
      value: 1,
      suit: 'green',
      playerPosition: 1,
      username: 'User 1',
    };
    const communicationOne: Communication = {
      type: 'highest',
      card,
    };
    const communicationTwo: Communication = {
      type: 'highest',
      card: { value: 5, suit: 'yellow', playerPosition: 2, username: 'User 2' },
    };
    service.updateRevealedCommunication(communicationOne);
    service.updateRevealedCommunication(communicationTwo);
    expect(service.revealedCommunications.length).toEqual(2);
    service.removePlayedCardFromCommunicationCards(card);
    expect(service.revealedCommunications.length).toEqual(1);
    expect(service.revealedCommunications[0]).toEqual(communicationTwo);
  });

  it('Updates last hand information on a completed trick', () => {
    const winningCard = {
      value: 5,
      suit: 'green',
      playerPosition: 1,
      username: 'User 1',
    };
    const cardInTrick = {
      value: 1,
      suit: 'blue',
      playerPosition: 2,
      username: 'User 2',
    };
    const cardInTrickTwo = {
      value: 1,
      suit: 'green',
      playerPosition: 3,
      username: 'User 3',
    };
    service.handleStartingCards(initialData);
    const trick = [winningCard, cardInTrick, cardInTrickTwo];
    service.completedTrick(trick, winningCard);
    const winningPlayer = service.playerSummary.find(
      (player) => player.playerPosition === 1
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
