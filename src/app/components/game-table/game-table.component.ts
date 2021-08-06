import { Component, Input } from '@angular/core';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SocketService } from '../../services/socket.service';
import { SharedGameStateService } from '../../services/shared-game-state.service';
import { PlayerCard, Player } from '../../types/game';

export interface CompleteTrick {
  trick: PlayerCard[];
  winningCard: PlayerCard;
}

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.sass'],
})
export class GameTableComponent {
  playedCards: PlayerCard[] = [];
  leadCard: PlayerCard | null = null;
  @Input() numberOfPlayers!: number;
  @Input() player!: Player | null;
  @Input() playerToTheLeft: Player | undefined;
  @Input() playerToTheRight: Player | undefined;
  @Input() playerTwoToTheLeft: Player | undefined;
  @Input() playerThreeToTheRight: Player | undefined;

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService
  ) {
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard();
    });
  }

  resolveTrick(): void {
    const playedTrump = this.playedCards.filter(
      (card: PlayerCard) => card.suit === 'rocket'
    );
    let winningCard: PlayerCard;
    if (playedTrump.length > 0) {
      playedTrump.sort((a, b) => b.value - a.value);
      winningCard = playedTrump[0];
    } else {
      const followedSuit = this.playedCards.filter(
        (card: PlayerCard) => this.leadCard && this.leadCard.suit === card.suit
      );
      followedSuit.sort((a, b) => b.value - a.value);
      winningCard = followedSuit[0];
    }
    this.cleanUpTrick(winningCard);
  }

  cleanUpTrick(winningCard: PlayerCard): void {
    setTimeout(() => {
      this.gameStateService.completedTrick(this.playedCards, winningCard);
      this.playedCards = [];
      this.leadCard = null;
    }, 3000);
  }

  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
    handleCardDropEvent<PlayerCard>(event);
    const card = event.container.data[event.currentIndex];
    this.socketService.cardPlayed(card);
    this.resolvePlayedCard();
  }

  resolvePlayedCard(): void {
    const { playedCards } = this;
    if (playedCards.length === 1) this.leadCard = playedCards[0];
    if (playedCards.length !== this.numberOfPlayers) return;
    this.resolveTrick();
  }
}
