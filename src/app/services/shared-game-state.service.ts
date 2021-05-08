import { Injectable } from '@angular/core';
import { PlayerCard, Communication, Player, GameState } from '../types/game';

@Injectable({
  providedIn: 'root',
})
export class SharedGameStateService {
  numberOfPlayers = 0;
  player: Player | null = null;
  revealedCommunications: Communication[] = [];
  playerSummary: Player[] = []; // will include tasks
  winningCard: PlayerCard | null = null;
  leadCard: PlayerCard | null = null;
  lastTrick: PlayerCard[] = [];
  isPlayerCommander = false;

  handleStartingCards(data: GameState): void {
    this.revealedCommunications = [];
    this.leadCard = null;
    this.lastTrick = [];
    this.winningCard = null;
    this.numberOfPlayers = data.playersInGame.length;
    this.player = data.player;
    this.playerSummary = data.playersInGame;
    this.isPlayerCommander = !!data.playersCards.find(
      (card) => card.suit === 'rocket' && card.value === 4
    );
  }

  updateRevealedCommunication(data: Communication): void {
    const uniqueCommunications = this.revealedCommunications.filter(
      ({ card }) =>
        !(card.suit === data.card.suit && card.value === data.card.value)
    );
    this.revealedCommunications = [...uniqueCommunications, data];
  }

  removePlayedCardFromCommunicationCards(playedCard: PlayerCard): void {
    this.revealedCommunications = this.revealedCommunications.filter(
      ({ card }) =>
        !(card.value === playedCard.value && card.suit === playedCard.suit)
    );
  }

  wonTricks(): number | null {
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerPosition === this.player?.playerPosition
    );
    if (!playerSummary || playerSummary.tricks < 0) return null;
    return playerSummary.tricks;
  }
  completedTrick(trick: PlayerCard[], winningCard: PlayerCard): void {
    this.winningCard = winningCard;
    this.incrementWinningPlayersTrickCount(winningCard);
  }

  incrementWinningPlayersTrickCount(winningCard: PlayerCard): void {
    const winningPlayer = this.playerSummary.find(
      (summary) =>
        winningCard && winningCard.playerPosition === summary.playerPosition
    );
    if (winningPlayer && winningPlayer.tricks >= 0) {
      winningPlayer.tricks = winningPlayer.tricks + 1;
    }
  }

  playerBySeatOrder(seatsFromCurrentPlayer: number): Player | undefined {
    if (!this.player) return;
    let otherPlayer = this.player.playerPosition + seatsFromCurrentPlayer;
    if (otherPlayer > this.numberOfPlayers) {
      otherPlayer = otherPlayer - this.numberOfPlayers;
    } else if (otherPlayer === 0) {
      otherPlayer = this.numberOfPlayers;
    }
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerPosition === otherPlayer
    );
    return playerSummary;
  }
  playerToTheLeft(): Player | undefined {
    return this.playerBySeatOrder(1);
  }
  playerToTheRight(): Player | undefined {
    return this.playerBySeatOrder(-1);
  }
}
