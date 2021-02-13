import { Component, Input } from '@angular/core';
import { Communication, PlayerCard } from '../types/game';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.sass'],
})
export class GameSummaryComponent {
  @Input() winningCard!: PlayerCard | null;
  @Input() numberOfPlayers!: number;
  @Input() isPlayerCommander!: boolean;
  @Input() leadCard!: PlayerCard | null;
  @Input() lastTrick!: PlayerCard[];
  @Input() revealedCommunications!: Communication[];

  formatInformation(card: PlayerCard, communicationType?: string): string {
    const playersCard = `Player ${card.player}`;
    return communicationType
      ? `${playersCard}'s ${communicationType}`
      : playersCard;
  }
}
