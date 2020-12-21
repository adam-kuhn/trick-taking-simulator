export interface Card {
  suit: string;
  value: number;
}

export interface PlayerCard extends Card {
  player: number;
}

export interface TaskCard extends PlayerCard {
  specificOrder?: number;
  relativeOrder?: number;
  lastTask?: boolean;
}

export interface InitialTasks {
  taskCards: TaskCard[];
  revealOnlyToCommander: boolean;
}

export interface GameState {
  player: number;
  numberOfPlayers: number;
  playersCards: PlayerCard[];
}
