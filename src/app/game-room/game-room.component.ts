import { Component } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
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
import { PlayerDisplayNamePipe } from '../pipes/player-display-name/player-display-name.pipe';
import {
  ConfirmDialogComponent,
  DialogActions,
  DialogData,
} from '../confirm-dialog/confirm-dialog.component';

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
  player: Player | null = null;
  playerSummary: Player[] = [];
  numberOfPlayers = 0;
  isPlayerCommander = false;
  communicationOptions = ['unknown', 'highest', 'lowest', 'only'];

  constructor(
    private gameService: GameService,
    private dialog: MatDialog,
    private playerDisplayName: PlayerDisplayNamePipe
  ) {
    this.gameService.recieveStartingCards().subscribe((data: GameState) => {
      this.clearOldGameInfo();
      this.cardsInHand = data.playersCards;
      this.player = data.player;
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
    this.gameService
      .recieveCardFromAnotherPlayer()
      .subscribe((data: PlayerCard) => {
        this.handleRecievedCardFromAnotherPlayer(data);
      });
  }

  openConfirmDrawCard(): void {
    const playerToRecieveCard = this.playerToTheLeft();
    if (!playerToRecieveCard) throw new Error('No player to the left');
    const data = {
      message: `Give a random card from your hand to ${this.playerDisplayName.transform(
        playerToRecieveCard
      )}?`,
      actions: DialogActions.CONFIRM,
    };
    const dialogRef = this.openConfirmDialog(data);

    dialogRef.afterClosed().subscribe((confirmation: string) => {
      if (confirmation === 'confirm') {
        const cardIndex = this.getIndexOfRandomCardToMove();
        this.handleGivingACardToAnotherPlayer(
          this.cardsInHand[cardIndex],
          playerToRecieveCard
        );
      }
    });
  }

  handleConfirmPassingCardDialog(card: PlayerCard): void {
    if (card.suit === 'rocket') {
      const data = {
        message: "You can't pass rocket cards.",
        actions: DialogActions.ACKNOWLEDGE,
      };
      this.openConfirmDialog(data, { disableClose: true });
    } else {
      const data = {
        card,
        message: 'Pass this card to the left or right?',
        actions: DialogActions.PLAYER_CHOICE,
      };
      const dialogRef = this.openConfirmDialog(data, { autoFocus: false });

      dialogRef.afterClosed().subscribe((direction: string) => {
        if (!direction) return;
        const player =
          direction === 'left'
            ? this.playerToTheLeft()
            : this.playerToTheRight();
        if (!player) throw new Error('No players beside current player');
        this.handleGivingACardToAnotherPlayer(card, player);
      });
    }
  }

  handleGivingACardToAnotherPlayer(
    cardToMove: PlayerCard,
    player: Player
  ): void {
    const cardIndex = this.cardsInHand.findIndex(
      (card) => card.suit === cardToMove.suit && card.value === cardToMove.value
    );
    const displayName = this.playerDisplayName.transform(player);
    const message = `You gave this card to ${displayName}.`;
    const afterClose = () => {
      this.cardsInHand.splice(cardIndex, 1);
      this.gameService.moveCardToAnotherPlayer(cardToMove, player);
    };
    this.openAcknowledgeDialog(message, cardToMove, afterClose);
  }

  handleRecievedCardFromAnotherPlayer(acknowledgedCard: PlayerCard): void {
    const displayName = this.playerDisplayName.transform(acknowledgedCard);
    const message = `You recieved this card from ${displayName}.`;
    const afterClose = () => {
      const card = this.setCardToCurrentPlayer(acknowledgedCard);
      this.cardsInHand.push(card);
    };
    this.openAcknowledgeDialog(message, acknowledgedCard, afterClose);
  }

  openAcknowledgeDialog(
    message: string,
    acknowledgedCard: PlayerCard,
    afterClose: () => void
  ): void {
    const data = {
      message,
      card: acknowledgedCard,
      actions: DialogActions.ACKNOWLEDGE,
    };
    const dialogRef = this.openConfirmDialog(data, { disableClose: true });
    dialogRef.afterClosed().subscribe(() => {
      afterClose();
    });
  }

  openConfirmDialog(
    data: DialogData,
    config?: MatDialogConfig
  ): MatDialogRef<ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, {
      ...config,
      data,
    });
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
          this.winningCard &&
          this.winningCard.playerPosition === summary.playerPosition
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

  wonTricks(): number | null {
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerPosition === this.player?.playerPosition
    );
    if (!playerSummary || playerSummary.tricks < 0) return null;
    return playerSummary.tricks;
  }

  findPlayerBySeatOrder(seatsFromCurrentPlayer: number): Player | undefined {
    if (!this.player) return;
    let otherPlayer = this.player.playerPosition + seatsFromCurrentPlayer;
    if (otherPlayer > this.numberOfPlayers) {
      otherPlayer = otherPlayer - this.numberOfPlayers;
    } else if (otherPlayer === 0) {
      otherPlayer = this.numberOfPlayers;
    }
    const playerSummary = this.playerSummary.find(
      (summary) => summary.playerPosition === otherPlayer
    );
    return playerSummary;
  }

  playerToTheLeft(): Player | undefined {
    return this.findPlayerBySeatOrder(1);
  }
  playerToTheRight(): Player | undefined {
    return this.findPlayerBySeatOrder(-1);
  }
  playersTableText(player: Player | undefined): string {
    if (!player) return '';
    const displayName = this.playerDisplayName.transform(player);
    return `${displayName}: tricks ${player.tricks}`;
  }

  getIndexOfRandomCardToMove(): number {
    const playersTotalCards = this.cardsInHand.length;
    const indexOfCard = Math.floor(Math.random() * playersTotalCards);
    return indexOfCard;
  }

  setCardToCurrentPlayer(card: PlayerCard): PlayerCard {
    if (!this.player) throw new Error('Current Player is not set');
    return {
      ...card,
      playerPosition: this.player.playerPosition,
      username: this.player.username,
    };
  }

  dealCards(): void {
    this.gameService.dealTheCards();
  }
}
