import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SocketService } from '../../services/socket.service';
import { Player, PlayerCard, GameState, Communication } from '../../types/game';
import { handleCardDropEvent } from '../../utils/card-dragging';

import {
  ConfirmDialogComponent,
  DialogActions,
  DialogData,
} from '../confirm-dialog/confirm-dialog.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';

@Component({
  selector: 'app-players-hand',
  templateUrl: './players-hand.component.html',
  styleUrls: ['./players-hand.component.sass'],
})
export class PlayersHandComponent {
  player: Player | null = null;
  cardsInHand: PlayerCard[] = [];
  @Input() playerToTheLeft: Player | undefined;
  @Input() playerToTheRight: Player | undefined;
  @Input() set playerSummary(value: Player[]) {
    const currentPlayer = value.find(
      (player) => player.playerPosition === this.player?.playerPosition
    );
    if (currentPlayer) {
      this.player = currentPlayer;
    }
  }

  constructor(
    private socketService: SocketService,
    private dialog: MatDialog,
    private playerDisplayName: PlayerDisplayNamePipe
  ) {
    this.socketService.recieveStartingCards().subscribe((data: GameState) => {
      this.cardsInHand = data.playersCards;
      this.player = data.player;
    });
    this.socketService
      .recieveCardFromAnotherPlayer()
      .subscribe((data: PlayerCard) => {
        this.handleRecievedCardFromAnotherPlayer(data);
      });
  }

  handleDrop(event: CdkDragDrop<PlayerCard[]>): void {
    handleCardDropEvent<PlayerCard>(event);
  }

  openConfirmDrawCard(): void {
    const playerToRecieveCard = this.playerToTheLeft;
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
          direction === 'left' ? this.playerToTheLeft : this.playerToTheRight;
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
      this.socketService.moveCardToAnotherPlayer(cardToMove, player);
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
}
