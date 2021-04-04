import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { GameService } from '../services/game.service';
import {
  GameState,
  PlayerCard,
  TaskCard,
  Communication,
  Player,
} from '../types/game';
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
  providers: [MatDialog],
})
export class GameRoomComponent {
  cardsInHand: PlayerCard[] = [];
  playedCards: PlayerCard[] = [];
  lastTrick: PlayerCard[] = [];
  leadCard: PlayerCard | null = null;
  winningCard: PlayerCard | null = null;
  communicationCard: PlayerCard[] = [];
  revealedCommunications: Communication[] = [];
  startingTasks: TaskCard[] = [];
  playerSummary: Player[] = [];
  playerId = 0;
  numberOfPlayers = 0;
  username = '';
  isPlayerCommander = false;
  communicationOptions = ['unknown', 'highest', 'lowest', 'only'];

  constructor(private gameService: GameService, private dialog: MatDialog) {
    this.gameService.recieveStartingCards().subscribe((data: GameState) => {
      this.clearOldGameInfo();
      this.cardsInHand = data.playersCards;
      this.playerId = data.player.playerId;
      this.username = data.player.username;
      this.numberOfPlayers = data.playersInGame.length;
      this.playerSummary = data.playersInGame;
      this.isPlayerCommander = !!data.playersCards.find(
        (card) => card.suit === 'rocket' && card.value === 4
      );
    });
    this.gameService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard(data);
    });
    this.gameService.recieveCommunication().subscribe((data: Communication) => {
      const uniqueCommunications = this.revealedCommunications.filter(
        ({ card }) =>
          !(card.suit === data.card.suit && card.value === data.card.value)
      );

      this.revealedCommunications = [...uniqueCommunications, data];
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
  resolvePlayedCard(playedCard: PlayerCard): void {
    const { playedCards } = this;
    this.revealedCommunications = this.revealedCommunications.filter(
      ({ card }) =>
        !(card.value === playedCard.value && card.suit === playedCard.suit)
    );
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
      this.leadCard = null;
      const winningPlayer = this.playerSummary.find(
        (summary) =>
          this.winningCard && this.winningCard.player === summary.playerId
      );
      if (winningPlayer && winningPlayer.tricks >= 0) {
        winningPlayer.tricks = winningPlayer.tricks + 1;
      }
    }, 3000);
  }
  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
    this.handleDrop(event);
    const card = event.container.data[event.currentIndex];
    this.gameService.cardPlayed(card);
    this.resolvePlayedCard(card);
  }
  cardPlacedInCommunication(event: CdkDragDrop<PlayerCard[]>): void {
    if (this.communicationCard.length === 1) return;
    this.handleDrop(event);
  }

  communicationDragTo(): string[] | string {
    const listsForDrag = ['playing-mat', 'players-hand'];
    if (!this.communicationCard[0]) return listsForDrag;
    const communicated = this.revealedCommunications.find(
      ({ card }) =>
        card.value === this.communicationCard[0].value &&
        card.suit === this.communicationCard[0].suit
    );
    return communicated ? 'playing-mat' : listsForDrag;
  }
  handleDrop(event: CdkDragDrop<PlayerCard[]>): void {
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
  }
  handleCommunication(event: MatSelectChange): void {
    this.gameService.sendCommunication({
      type: event.value,
      card: this.communicationCard[0],
    });
  }
  clearOldGameInfo(): void {
    this.revealedCommunications = [];
    this.communicationCard = [];
    this.leadCard = null;
    this.playedCards = [];
    this.lastTrick = [];
    this.winningCard = null;
  }
  playerInTableSeatOrder(seatsFromCurrentPlayer: number): string {
    let otherPlayer = this.playerId + seatsFromCurrentPlayer;
    if (otherPlayer > this.numberOfPlayers) {
      otherPlayer = otherPlayer - this.numberOfPlayers;
    } else if (otherPlayer === 0) {
      otherPlayer = this.numberOfPlayers;
    }
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerId === otherPlayer
    );
    if (!playerSummary) return '';
    const displayName = playerSummary.username
      ? playerSummary.username
      : `Player ${playerSummary.playerId}`;
    return `${displayName}: tricks ${playerSummary.tricks}`;
  }
  wonTricks(): number | null {
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerId === this.playerId
    );
    if (!playerSummary || playerSummary.tricks < 0) return null;
    return playerSummary.tricks;
  }
}
