import { Component } from '@angular/core';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SocketService } from '../../services/socket.service';
import { SharedGameStateService } from '../../services/shared-game-state.service';
import { PlayerCard, Player } from '../../types/game';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';

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

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService,
    private playerDisplayName: PlayerDisplayNamePipe
  ) {
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard(data);
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
    handleCardDropEvent(event);
    const card = event.container.data[event.currentIndex];
    this.socketService.cardPlayed(card);
    this.resolvePlayedCard(card);
  }

  resolvePlayedCard(playedCard: PlayerCard): void {
    const { playedCards } = this;
    this.gameStateService.removePlayedCardFromCommunicationCards(playedCard);
    if (playedCards.length === 1) this.leadCard = playedCards[0];
    if (playedCards.length !== this.gameStateService.numberOfPlayers) return;
    this.resolveTrick();
  }

  findPlayerBySeatOrder(positionFromCurrentPlayer: number): Player | undefined {
    return this.gameStateService.playerBySeatOrder(positionFromCurrentPlayer);
  }

  playersTableText(player: Player | undefined): string {
    if (!player) return '';
    const displayName = this.playerDisplayName.transform(player);
    return `${displayName}: tricks ${player.tricks}`;
  }
}
