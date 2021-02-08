import { Component, Input } from '@angular/core';
import { GameService } from '../services/game.service';
import { Communication, PlayerCard } from '../types/game';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.sass'],
  providers: [GameService],
})
export class GameSummaryComponent {
  @Input() numberOfPlayers!: number;
  @Input() isPlayerCommander!: boolean;
  @Input() winningCard!: PlayerCard | null;
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
