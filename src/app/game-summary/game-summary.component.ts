import { Component, Input } from '@angular/core';
import { Communication, PlayerCard, Player } from '../types/game';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.sass'],
})
export class GameSummaryComponent {
  @Input() winningCard!: PlayerCard | null;
  @Input() isPlayerCommander!: boolean;
  @Input() leadCard!: PlayerCard | null;
  @Input() lastTrick!: PlayerCard[];
  @Input() revealedCommunications!: Communication[];
  @Input() playerSummary!: Player[];

  cardPlayedBy(card: PlayerCard): string {
    const playedBy = this.playerSummary.find(
      (player) => player.playerId === card.player
    );
    if (!playedBy) return 'Unknown player';
    return playedBy.username
      ? playedBy.username
      : `Player ${playedBy.playerId}`;
  }
  formatInformation(card: PlayerCard, communicationType?: string): string {
    const playersCard = this.cardPlayedBy(card);
    return communicationType
      ? `${playersCard}'s ${communicationType}`
      : playersCard;
  }
}
