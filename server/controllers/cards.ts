export interface Card {
  value: number;
  suit: Suits;
}

export enum Suits {
  Green = 'green',
  Blue = 'blue',
  Pink = 'pink',
  Violet = 'violet',
  Rocket = 'rocket',
}

export interface PlayerCard extends Card {
  playerPosition: number;
  username?: string;
}

export interface Communicate extends Card {
  type: string;
}

export interface TaskCard extends PlayerCard {
  completed: boolean;
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

export interface SwappingTasks {
  taskOne: TaskCard;
  taskTwo: TaskCard;
}

const CREW_TRUMP_CARDS: Card[] = [
  {
    suit: Suits.Rocket,
    value: 1,
  },
  {
    suit: Suits.Rocket,
    value: 2,
  },
  {
    suit: Suits.Rocket,
    value: 3,
  },
  {
    suit: Suits.Rocket,
    value: 4,
  },
];

export const crewDeck: Card[] = (() => {
  const suits = [Suits.Green, Suits.Blue, Suits.Pink, Suits.Violet];
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
    const cardToDeal = { ...card, playerPosition: playerToDeal };
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
    ...sortCardsBySuit(Suits.Blue, cards),
    ...sortCardsBySuit(Suits.Pink, cards),
    ...sortCardsBySuit(Suits.Green, cards),
    ...sortCardsBySuit(Suits.Violet, cards),
    ...sortCardsBySuit(Suits.Rocket, cards),
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
  const deckCopy = [...crewDeck];
  const taskDeck: TaskCard[] = shuffleCards(deckCopy)
    .splice(0, totalTasks)
    .map((card) => {
      return {
        ...card,
        completed: false,
        playerPosition: 0,
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

export function swapTaskCardRequirements(tasks: SwappingTasks): SwappingTasks {
  const { taskOne, taskTwo } = tasks;
  const taskOneOrder = getTaskOrder(taskOne);
  const taskTwoOrder = getTaskOrder(taskTwo);
  const updatedTaskOne = updateTaskCardOrdering(taskOne, taskTwoOrder);
  const updatedTaskTwo = updateTaskCardOrdering(taskTwo, taskOneOrder);
  return { taskOne: updatedTaskOne, taskTwo: updatedTaskTwo };
}

export function getTaskOrder(
  task: TaskCard
): { relativeOrder?: number; specificOrder?: number; lastTask?: boolean } {
  const { relativeOrder, specificOrder, lastTask } = task;
  if (relativeOrder) return { relativeOrder };
  if (specificOrder) return { specificOrder };
  if (lastTask) return { lastTask };
  return {};
}
function updateTaskCardOrdering(
  task: TaskCard,
  ordering: Partial<TaskCard>
): TaskCard {
  return {
    suit: task.suit,
    value: task.value,
    playerPosition: task.playerPosition,
    username: task.username,
    completed: task.completed,
    ...ordering,
  };
}
