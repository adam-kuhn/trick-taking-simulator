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
  playedCardsOtherPlayers: PlayerCard[] = [];
  playedCardCurrentPlayer: PlayerCard[] = [];
  get leadCard(): PlayerCard | null {
    return this.gameStateService.leadCard;
  }
  @Input() numberOfPlayers!: number;
  @Input() playerToTheLeft: Player | undefined;
  @Input() playerToTheRight: Player | undefined;
  @Input() playerTwoToTheLeft: Player | undefined;
  @Input() playerThreeToTheRight: Player | undefined;

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService
  ) {
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCardsOtherPlayers = [...this.playedCardsOtherPlayers, data];
      this.resolvePlayedCard();
    });
  }

  resolveTrick(): void {
    const cardsInTrick = this.playedCardCurrentPlayer.concat(
      this.playedCardsOtherPlayers
    );
    const playedTrump = cardsInTrick.filter(
      (card: PlayerCard) => card.suit === 'rocket'
    );
    let winningCard: PlayerCard;
    if (playedTrump.length > 0) {
      playedTrump.sort((a, b) => b.value - a.value);
      winningCard = playedTrump[0];
    } else {
      const followedSuit = cardsInTrick.filter(
        (card: PlayerCard) => this.leadCard && this.leadCard.suit === card.suit
      );
      followedSuit.sort((a, b) => b.value - a.value);
      winningCard = followedSuit[0];
    }
    this.cleanUpTrick(winningCard);
  }

  cleanUpTrick(winningCard: PlayerCard): void {
    setTimeout(() => {
      this.gameStateService.completedTrick(
        this.playedCardCurrentPlayer.concat(this.playedCardsOtherPlayers),
        winningCard
      );
      this.playedCardsOtherPlayers = [];
      this.playedCardCurrentPlayer = [];
      this.gameStateService.leadCard = null;
    }, 3000);
  }

  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
    if (this.playedCardCurrentPlayer.length === 1) return;
    handleCardDropEvent<PlayerCard>(event);
    const card = event.container.data[event.currentIndex];
    this.socketService.cardPlayed(card);
    this.resolvePlayedCard();
  }

  resolvePlayedCard(): void {
    const { playedCardCurrentPlayer, playedCardsOtherPlayers } = this;
    if (!this.leadCard) {
      this.setLeadCard();
    }
    if (
      playedCardsOtherPlayers.length + playedCardCurrentPlayer.length !==
      this.numberOfPlayers
    )
      return;
    this.resolveTrick();
  }

  setLeadCard(): void {
    const { playedCardCurrentPlayer, playedCardsOtherPlayers } = this;
    const playerCard = playedCardCurrentPlayer.length;
    const otherCards = playedCardsOtherPlayers.length;
    const currentPlayerHaslLead = playerCard === 1 && otherCards === 0;
    const leadCard = currentPlayerHaslLead
      ? playedCardCurrentPlayer[0]
      : playedCardsOtherPlayers[0];
    this.gameStateService.leadCard = leadCard;
  }
}
