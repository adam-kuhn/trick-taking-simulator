export interface Card {
  value: number;
  suit: string;
}

export interface PlayerCard extends Card {
  player: number;
}

export interface TaskCard extends PlayerCard {
  specificOrder?: number;
  relativeOrder?: number;
  lastTask?: boolean;
}

export interface TaskOptions {
  totalTasks: number;
  orderedTasks: number;
  relativeTasks: number;
  revealOnlyToCommander: boolean;
  lastCompletedTask: boolean;
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

export const crewDeck: Card[] = (() => {
  const suits = ['green', 'blue', 'pink', 'yellow'];
  let deck: Card[] = [];
  suits.forEach((suit) => {
    for (let i = 1; i < 10; i++) {
      deck = [...deck, { suit, value: i }];
    }
  });
  return deck;
})();

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
  const playingDeck: Card[] = shuffleCards([...CREW_TRUMP_CARDS, ...crewDeck]);
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

export function sortHandOfCards(cards: PlayerCard[]): PlayerCard[] {
  return [
    ...sortCardsBySuit('blue', cards),
    ...sortCardsBySuit('pink', cards),
    ...sortCardsBySuit('green', cards),
    ...sortCardsBySuit('yellow', cards),
    ...sortCardsBySuit('rocket', cards),
  ];
}

function sortCardsBySuit(suit: string, cards: PlayerCard[]): PlayerCard[] {
  return cards
    .filter((card) => card.suit === suit)
    .sort((a, b) => a.value - b.value);
}

export function dealTaskCards(options: TaskOptions): TaskCard[] {
  const {
    totalTasks,
    orderedTasks,
    relativeTasks,
    lastCompletedTask,
  } = options;
  const taskDeck: TaskCard[] = shuffleCards(crewDeck)
    .splice(0, totalTasks)
    .map((card) => {
      return {
        ...card,
        player: 0,
      };
    });
  if (orderedTasks > 0) {
    assignSpecificTaskOrder(taskDeck, orderedTasks);
  }
  if (relativeTasks > 0) {
    assignRelativeTaskOrder(taskDeck, relativeTasks);
  }
  if (lastCompletedTask) {
    const avialableTask = taskDeck.find(
      (task) => !task.relativeOrder && !task.specificOrder
    );
    if (avialableTask) avialableTask.lastTask = true;
  }
  return taskDeck.splice(0, totalTasks);
}

function assignSpecificTaskOrder(deck: TaskCard[], orderedTasks: number): void {
  let order = 1;
  let assignTasks = 0;
  deck.forEach((task) => {
    if (assignTasks === orderedTasks) return;
    const taskHasRequirement =
      task.lastTask || (task.relativeOrder ? task.relativeOrder > 0 : false);
    if (taskHasRequirement) return;
    task.specificOrder = order;
    order++;
    assignTasks++;
  });
}

function assignRelativeTaskOrder(
  deck: TaskCard[],
  relativeTasks: number
): void {
  let order = 1;
  let assignedTasks = 0;
  deck.forEach((task) => {
    if (assignedTasks === relativeTasks) return;
    const taskHasRequirement =
      task.lastTask || (task.specificOrder ? task.specificOrder > 0 : false);
    if (taskHasRequirement) return;
    task.relativeOrder = order;
    order++;
    assignedTasks++;
  });
}
