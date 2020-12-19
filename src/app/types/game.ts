export interface Card {
  suit: string;
  value: number;
  player?: number;
}

export interface PlayerCard extends Card {
  player: number;
}

export interface InitialTasks {
  taskCards: Card[];
  revealOnlyToCommander: boolean;
}

export interface GameState {
  player: number;
  numberOfPlayers: number;
  playersCards: PlayerCard[];
}
