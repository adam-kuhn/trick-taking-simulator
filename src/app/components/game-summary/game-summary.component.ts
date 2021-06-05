import { Component, Input } from '@angular/core';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { Communication, PlayerCard } from '../../types/game';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.sass'],
})
export class GameSummaryComponent {
  @Input() winningCard!: PlayerCard | null;
  @Input() leadCard!: PlayerCard | null;
  @Input() lastTrick!: PlayerCard[];
  @Input() revealedCommunications!: Communication[];

  constructor(private playerDisplayName: PlayerDisplayNamePipe) {}

  formatInformation(card: PlayerCard, communicationType?: string): string {
    const playersCard = this.playerDisplayName.transform(card);
    return communicationType
      ? `${playersCard}'s ${communicationType}`
      : playersCard;
  }
}
