import { expect } from 'chai';
import { createCrewSuites, dealCards } from '../controllers/cards';

describe('createCrewSuites', function () {
  it('generates a deck with 4 suits and 9 cards for each suit', function () {
    const cards = createCrewSuites();
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
