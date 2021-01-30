import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GameService } from '../services/game.service';
import { GameState, PlayerCard, TaskCard } from '../types/game';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import {
  DealTaskDialogComponent,
  TaskOptions,
} from '../deal-task-dialog/deal-task-dialog.component';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.sass'],
  providers: [GameService, MatDialog],
})
export class GameRoomComponent {
  cardsInHand: PlayerCard[] = [];
  playedCards: PlayerCard[] = [];
  lastTrick: PlayerCard[] = [];
  winningCard: PlayerCard | null = null;
  leadCard: PlayerCard | null = null;
  startingTasks: TaskCard[] = [];
  numberOfPlayers = 0;
  player = 0;
  isPlayerCommander = false;

  constructor(private gameService: GameService, private dialog: MatDialog) {
    this.gameService.recieveStartingCards().subscribe((data: GameState) => {
      this.numberOfPlayers = data.numberOfPlayers;
      this.cardsInHand = data.playersCards;
      this.player = data.player;
      this.isPlayerCommander = !!data.playersCards.find(
        (card) => card.suit === 'rocket' && card.value === 4
      );
    });
    this.gameService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard();
    });
  }

  dealCards(): void {
    this.gameService.dealTheCards();
  }

  openTaskDealDialog(): void {
    const dialogRef = this.dialog.open(DealTaskDialogComponent);
    dialogRef.afterClosed().subscribe((options: TaskOptions) => {
      this.gameService.dealTaskCards(options);
    });
  }
  resolvePlayedCard(): void {
    const { playedCards } = this;
    if (playedCards.length === 1) this.leadCard = playedCards[0];
    if (playedCards.length !== this.numberOfPlayers) return;
    this.resolveTrick();
  }
  resolveTrick(): void {
    const playedTrump = this.playedCards.filter(
      (card: PlayerCard) => card.suit === 'rocket'
    );

    if (playedTrump.length > 0) {
      playedTrump.sort((a, b) => b.value - a.value);
      this.winningCard = playedTrump[0];
    } else {
      const followedSuit = this.playedCards.filter(
        (card: PlayerCard) => this.leadCard && this.leadCard.suit === card.suit
      );
      followedSuit.sort((a, b) => b.value - a.value);
      this.winningCard = followedSuit[0];
    }
    this.cleanUpTrick();
  }
  cleanUpTrick(): void {
    setTimeout(() => {
      this.lastTrick = [...this.playedCards];
      this.playedCards = [];
    }, 3000);
  }
  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
    const {
      container: currentContainer,
      previousContainer,
      currentIndex,
      previousIndex,
    } = event;
    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, previousIndex, currentIndex);
      return;
    }
    transferArrayItem(
      previousContainer.data,
      currentContainer.data,
      previousIndex,
      currentIndex
    );

    this.gameService.cardPlayed(currentContainer.data[currentIndex]);
    this.resolvePlayedCard();
  }
}
