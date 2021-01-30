import { expect } from 'chai';
import {
  crewDeck,
  dealCards,
  sortHandOfCards,
  dealTaskCards,
} from '../controllers/cards';

describe('createCrewSuites', function () {
  it('generates a deck with 4 suits and 9 cards for each suit', function () {
    const cards = crewDeck;
    const greenCards = cards.filter((card) => card.suit === 'green').length;
    const pinkCards = cards.filter((card) => card.suit === 'pink').length;
    const blueCards = cards.filter((card) => card.suit === 'blue').length;
    const yellowCards = cards.filter((card) => card.suit === 'yellow').length;
    expect(cards.length).to.equal(36);
    expect(greenCards).to.equal(9);
    expect(pinkCards).to.equal(9);
    expect(blueCards).to.equal(9);
    expect(yellowCards).to.equal(9);
  });
});

describe('dealCards', function () {
  it('deals 10 cards to each player in a 4 player game', function () {
    const numberOfPlayers = 4;
    const dealtCards = dealCards(numberOfPlayers);

    expect(dealtCards['1'].length).to.equal(10);
    expect(dealtCards['2'].length).to.equal(10);
    expect(dealtCards['3'].length).to.equal(10);
    expect(dealtCards['4'].length).to.equal(10);
    expect(dealtCards['1'][0]).to.have.property('suit');
    expect(dealtCards['1'][0]).to.have.property('value');
  });

  it('deals 13 cards to 2 players and 14 cards to 1 player in a 3 player game', function () {
    const numberOfPlayers = 3;
    const dealtCards = dealCards(numberOfPlayers);

    expect(dealtCards['1'].length).to.equal(13);
    expect(dealtCards['2'].length).to.equal(13);
    expect(dealtCards['3'].length).to.equal(14);
    expect(dealtCards['1'][0]).to.have.property('suit');
    expect(dealtCards['1'][0]).to.have.property('value');
  });

  it('deals 8 cards to each player in a 5 player game', function () {
    const numberOfPlayers = 5;
    const dealtCards = dealCards(numberOfPlayers);

    expect(dealtCards['1'].length).to.equal(8);
    expect(dealtCards['2'].length).to.equal(8);
    expect(dealtCards['3'].length).to.equal(8);
    expect(dealtCards['4'].length).to.equal(8);
    expect(dealtCards['5'].length).to.equal(8);
    expect(dealtCards['1'][0]).to.have.property('suit');
    expect(dealtCards['1'][0]).to.have.property('value');
  });
});

describe('sortHandOfCards', function () {
  it('sorts a hand of cards', function () {
    const playersHand = [
      { suit: 'blue', value: 5, player: 1 },
      { suit: 'yellow', value: 2, player: 1 },
      { suit: 'blue', value: 1, player: 1 },
      { suit: 'pink', value: 9, player: 1 },
      { suit: 'green', value: 4, player: 1 },
      { suit: 'rocket', value: 3, player: 1 },
      { suit: 'yellow', value: 3, player: 1 },
      { suit: 'pink', value: 5, player: 1 },
      { suit: 'blue', value: 2, player: 1 },
    ];
    const expected = [
      { suit: 'blue', value: 1, player: 1 },
      { suit: 'blue', value: 2, player: 1 },
      { suit: 'blue', value: 5, player: 1 },
      { suit: 'pink', value: 5, player: 1 },
      { suit: 'pink', value: 9, player: 1 },
      { suit: 'green', value: 4, player: 1 },
      { suit: 'yellow', value: 2, player: 1 },
      { suit: 'yellow', value: 3, player: 1 },
      { suit: 'rocket', value: 3, player: 1 },
    ];
    const actual = sortHandOfCards(playersHand);
    expect(actual).to.deep.equal(expected);
  });
});

describe('dealTaskCards', function () {
  it('does not assign requirements when non are provided', function () {
    const taskOptions = {
      totalTasks: 5,
      orderedTasks: 0,
      relativeTasks: 0,
      lastCompletedTask: false,
      revealOnlyToCommander: false,
    };
    const actual = dealTaskCards(taskOptions);
    expect(actual.length).to.equal(5);
    expect(actual[0]).to.not.have.property('relativeOrder');
    expect(actual[0]).to.not.have.property('specificOrder');
    expect(actual[0]).to.not.have.property('lastTask');
  });
  it('correctly assign task requirements', function () {
    const taskOptions = {
      totalTasks: 5,
      orderedTasks: 1,
      relativeTasks: 2,
      lastCompletedTask: true,
      revealOnlyToCommander: false,
    };
    const actual = dealTaskCards(taskOptions);
    expect(actual.length).to.equal(5);
    expect(actual[0]).to.not.have.property('relativeOrder');
    expect(actual[0]).to.have.property('specificOrder', 1);
    expect(actual[0]).to.not.have.property('lastTask');
    expect(actual[1]).to.have.property('relativeOrder', 1);
    expect(actual[1]).to.not.have.property('specificOrder');
    expect(actual[1]).to.not.have.property('lastTask');
    expect(actual[2]).to.have.property('relativeOrder', 2);
    expect(actual[2]).to.not.have.property('specificOrder');
    expect(actual[2]).to.not.have.property('lastTask');
    expect(actual[3]).to.not.have.property('relativeOrder');
    expect(actual[3]).to.not.have.property('specificOrder');
    expect(actual[3]).to.have.property('lastTask', true);
    expect(actual[4]).to.not.have.property('relativeOrder');
    expect(actual[4]).to.not.have.property('specificOrder');
    expect(actual[4]).to.not.have.property('lastTask');
  });
});
