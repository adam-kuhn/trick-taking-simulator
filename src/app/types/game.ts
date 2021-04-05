export interface Card {
  suit: string;
  value: number;
}

export interface PlayerCard extends Card {
  playerPosition: number;
  username: string;
}

export interface TaskCard extends PlayerCard {
  completed: boolean;
  specificOrder?: number;
  relativeOrder?: number;
  lastTask?: boolean;
}

export interface InitialTasks {
  taskCards: TaskCard[];
  revealOnlyToCommander: boolean;
}

export interface Player {
  socket: string;
  playerPosition: number;
  username: string;
  tricks: number;
}

export interface GameState {
  player: Player;
  playersInGame: Player[];
  playersCards: PlayerCard[];
}

export interface Communication {
  type: string;
  card: PlayerCard;
}
