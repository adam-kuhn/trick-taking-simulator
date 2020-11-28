export interface Card {
  value: number;
  suit: string;
}

const CREW_TRUMP_CARDS: Card[] = [
  {
    suit: 'rocket',
    value: 1,
  },
  {
    suit: 'rocket',
    value: 2,
  },
  {
    suit: 'rocket',
    value: 3,
  },
  {
    suit: 'rocket',
    value: 4,
  },
];

export const createCrewSuites = (): Card[] => {
  const suits = ['green', 'blue', 'pink', 'yellow'];
  let deck: Card[] = [];
  suits.forEach((suit) => {
    for (let i = 1; i < 10; i++) {
      deck = [...deck, { suit, value: i }];
    }
  });
  return deck;
};

const shuffleCards = (cards: Card[]): Card[] => {
  let currentIndex = cards.length;
  let temporaryValue;
  let randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
  return cards;
};

export function dealCards(numberOfPlayers: number): { [key: string]: Card[] } {
  const playingDeck: Card[] = shuffleCards([
    ...CREW_TRUMP_CARDS,
    ...createCrewSuites(),
  ]);
  let playerToDeal = numberOfPlayers;
  const dealtCards: { [key: string]: Card[] } = {};
  for (let i = 0; i < playingDeck.length; i++) {
    dealtCards[playerToDeal] = dealtCards[playerToDeal]
      ? [...dealtCards[playerToDeal], playingDeck[i]]
      : [playingDeck[i]];
    playerToDeal--;
    if (playerToDeal === 0) {
      playerToDeal = numberOfPlayers;
    }
  }
  return dealtCards;
}
