import { Component, Input, OnChanges } from '@angular/core';
import { GameSummaryService } from '../services/game-summary.service';
import { Communication, PlayerCard } from '../types/game';

@Component({
  selector: 'app-game-summary',
  templateUrl: './game-summary.component.html',
  styleUrls: ['./game-summary.component.sass'],
})
export class GameSummaryComponent implements OnChanges {
  @Input() numberOfPlayers!: number;
  @Input() isPlayerCommander!: boolean;
  @Input() leadCard!: PlayerCard | null;
  @Input() lastTrick!: PlayerCard[];
  @Input() revealedCommunications!: Communication[];

  winningCard: PlayerCard | null = null;
  wonTrickSummary: { player: number; tricks: number }[] = [];

  constructor(private gameSummaryService: GameSummaryService) {
    this.gameSummaryService.winningCard$.subscribe((card) => {
      this.winningCard = card;
      if (!this.winningCard) return;
      const winnerOfLastTrick = this.winningCard.player;
      const playerSummary = this.wonTrickSummary.find(
        (summary) => summary.player === winnerOfLastTrick
      );
      if (!playerSummary) return;
      playerSummary.tricks++;
    });
  }

  ngOnChanges(): void {
    if (
      this.wonTrickSummary.length !== this.numberOfPlayers ||
      this.winningCard === null
    ) {
      this.createTrickSummary();
    }
  }

  createTrickSummary(): void {
    this.wonTrickSummary = [...Array(this.numberOfPlayers).keys()].map(
      (player) => {
        return {
          player: player + 1,
          tricks: 0,
        };
      }
    );
  }

  formatInformation(card: PlayerCard, communicationType?: string): string {
    const playersCard = `Player ${card.player}`;
    return communicationType
      ? `${playersCard}'s ${communicationType}`
      : playersCard;
  }
}
