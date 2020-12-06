export interface Card {
  value: number;
  suit: string;
}

export interface PlayerCard extends Card {
  player: number;
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

export function dealCards(
  numberOfPlayers: number
): { [key: string]: PlayerCard[] } {
  const playingDeck: Card[] = shuffleCards([
    ...CREW_TRUMP_CARDS,
    ...createCrewSuites(),
  ]);
  let playerToDeal = numberOfPlayers;
  const dealtCards: { [key: string]: PlayerCard[] } = {};
  for (const card of playingDeck) {
    const cardToDeal = { ...card, player: playerToDeal };
    dealtCards[playerToDeal] = dealtCards[playerToDeal]
      ? [...dealtCards[playerToDeal], cardToDeal]
      : [cardToDeal];
    playerToDeal--;
    if (playerToDeal === 0) {
      playerToDeal = numberOfPlayers;
    }
  }
  return dealtCards;
}
