import { Injectable } from '@angular/core';
import { PlayerCard, Player, GameState, TaskCard, Suits } from '../types/game';

@Injectable({
  providedIn: 'root',
})
export class SharedGameStateService {
  public leadCard: PlayerCard | null = null;
  public tasks: TaskCard[] = [];
  private _numberOfPlayers = 0;
  private _player: Player | null = null;
  private _playerSummary: Player[] = []; // will include tasks
  private _winningCard: PlayerCard | null = null;
  private _lastTrick: PlayerCard[] = [];
  private _isPlayerCommander = false;

  get numberOfPlayers(): number {
    return this._numberOfPlayers;
  }
  get player(): Player | null {
    return this._player;
  }
  get playerSummary(): Player[] {
    return this._playerSummary;
  }
  get winningCard(): PlayerCard | null {
    return this._winningCard;
  }
  get lastTrick(): PlayerCard[] {
    return this._lastTrick;
  }
  get isPlayerCommander(): boolean {
    return this._isPlayerCommander;
  }
  get playerToTheLeft(): Player | undefined {
    return this.playerBySeatOrder(1);
  }
  get playerToTheRight(): Player | undefined {
    return this.playerBySeatOrder(-1);
  }
  get playerTwoToTheLeft(): Player | undefined {
    return this.playerBySeatOrder(2);
  }
  get playerThreeToTheleft(): Player | undefined {
    return this.playerBySeatOrder(3);
  }

  handleStartingCards(data: GameState): void {
    this.leadCard = null;
    this._lastTrick = [];
    this._winningCard = null;
    this._numberOfPlayers = data.playersInGame.length;
    this._player = data.player;
    this._playerSummary = data.playersInGame;
    this._isPlayerCommander = !!data.playersCards.find(
      (card) => card.suit === Suits.Rocket && card.value === 4
    );
  }

  completedTrick(trick: PlayerCard[], winningCard: PlayerCard): void {
    this._winningCard = winningCard;
    this._lastTrick = trick;
    this.incrementWinningPlayersTrickCount(winningCard);
  }

  private playerBySeatOrder(
    seatsFromCurrentPlayer: number
  ): Player | undefined {
    if (!this._player) return;
    let otherPlayer = this._player.playerPosition + seatsFromCurrentPlayer;
    if (otherPlayer > this._numberOfPlayers) {
      otherPlayer = otherPlayer - this._numberOfPlayers;
    } else if (otherPlayer === 0) {
      otherPlayer = this._numberOfPlayers;
    }
    const playerSummary = this._playerSummary.find(
      (summary) => summary.playerPosition === otherPlayer
    );
    return playerSummary;
  }

  private incrementWinningPlayersTrickCount(winningCard: PlayerCard): void {
    const winningPlayer = this._playerSummary.find(
      (summary) =>
        winningCard && winningCard.playerPosition === summary.playerPosition
    );
    if (
      winningPlayer &&
      this._player &&
      winningPlayer.playerPosition === this._player?.playerPosition
    ) {
      this._player.tricks = this._player.tricks + 1;
    }
    if (winningPlayer && winningPlayer.tricks >= 0) {
      winningPlayer.tricks = winningPlayer.tricks + 1;
    }
  }
}
