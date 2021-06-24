import { Injectable } from '@angular/core';
import { PlayerCard, Communication, Player, GameState } from '../types/game';

@Injectable({
  providedIn: 'root',
})
export class SharedGameStateService {
  private _numberOfPlayers = 0;
  private _player: Player | null = null;
  private _revealedCommunications: Communication[] = [];
  private _playerSummary: Player[] = []; // will include tasks
  private _winningCard: PlayerCard | null = null;
  private _leadCard: PlayerCard | null = null;
  private _lastTrick: PlayerCard[] = [];
  private _isPlayerCommander = false;

  get numberOfPlayers(): number {
    return this._numberOfPlayers;
  }
  get player(): Player | null {
    return this._player;
  }
  get revealedCommunications(): Communication[] {
    return this._revealedCommunications;
  }
  get playerSummary(): Player[] {
    return this._playerSummary;
  }
  get winningCard(): PlayerCard | null {
    return this._winningCard;
  }
  get leadCard(): PlayerCard | null {
    return this._leadCard;
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
  get playerThreeToTheRight(): Player | undefined {
    return this.playerBySeatOrder(3);
  }

  handleStartingCards(data: GameState): void {
    this._revealedCommunications = [];
    this._leadCard = null;
    this._lastTrick = [];
    this._winningCard = null;
    this._numberOfPlayers = data.playersInGame.length;
    console.log('DATA P', data.player);
    this._player = data.player;
    this._playerSummary = data.playersInGame;
    this._isPlayerCommander = !!data.playersCards.find(
      (card) => card.suit === 'rocket' && card.value === 4
    );
  }

  updateRevealedCommunication(data: Communication): void {
    const uniqueCommunications = this._revealedCommunications.filter(
      ({ card }) =>
        !(card.suit === data.card.suit && card.value === data.card.value)
    );
    this._revealedCommunications = [...uniqueCommunications, data];
  }

  removePlayedCardFromCommunicationCards(playedCard: PlayerCard): void {
    this._revealedCommunications = this._revealedCommunications.filter(
      ({ card }) =>
        !(card.value === playedCard.value && card.suit === playedCard.suit)
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
    /* This is a flaky way to increment trick count for the current player, becuase of
    what object we are using to display the current players info.
    A better solution may be to this.playerBySeatOrder, but set a flag of
    some sort to determine we want the current player */
    if (
      winningPlayer &&
      this._player &&
      winningPlayer.playerPosition === this._player?.playerPosition
    ) {
      this._player.tricks = this._player.tricks + 1;
    } else if (winningPlayer && winningPlayer.tricks >= 0) {
      winningPlayer.tricks = winningPlayer.tricks + 1;
    }
  }
}
