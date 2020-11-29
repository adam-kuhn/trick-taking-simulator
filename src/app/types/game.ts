export interface Card {
  suit: string;
  value: number;
}

export interface GameState {
  player: number;
  numberOfPlayers: number;
  playersCards: Card[];
}
