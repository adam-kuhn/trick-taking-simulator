export interface Card {
  suit: string;
  value: number;
}

export interface PlayerCard extends Card {
  player: number;
}

export interface GameState {
  player: number;
  numberOfPlayers: number;
  playersCards: PlayerCard[];
}
