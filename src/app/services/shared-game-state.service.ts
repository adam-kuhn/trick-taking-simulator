import { Injectable } from '@angular/core';
import { PlayerCard, Communication, Player } from '../types/game';

@Injectable({
  providedIn: 'root',
})
export class SharedGameStateService {
  numberOfPlayers = 0;
  player: Player | null = null;
  revealedCommunications: Communication[] = [];
  playerSummary: Player[] = []; // will include tasks

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
