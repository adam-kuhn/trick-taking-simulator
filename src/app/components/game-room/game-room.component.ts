import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SocketService } from '../../services/socket.service';
import { GameState, PlayerCard, Communication, Player } from '../../types/game';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  DealTaskDialogComponent,
  TaskOptions,
} from '../deal-task-dialog/deal-task-dialog.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { SharedGameStateService } from '../../services/shared-game-state.service';
import { handleCardDropEvent } from '../../utils/card-dragging';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.sass'],
  providers: [MatDialog],
})
export class GameRoomComponent {
  playedCards: PlayerCard[] = [];
  lastTrick: PlayerCard[] = [];
  leadCard: PlayerCard | null = null;
  winningCard: PlayerCard | null = null;
  isPlayerCommander = false;
  dealingCompleted = false;

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService,
    private dialog: MatDialog,
    private playerDisplayName: PlayerDisplayNamePipe
  ) {
    this.socketService.recieveStartingCards().subscribe((data: GameState) => {
      this.clearOldGameInfo();
      this.gameStateService.numberOfPlayers = data.playersInGame.length;
      this.gameStateService.player = data.player;
      this.gameStateService.playerSummary = data.playersInGame;
      this.isPlayerCommander = !!data.playersCards.find(
        (card) => card.suit === 'rocket' && card.value === 4
      );
      this.dealingCompleted = true;
    });
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard(data);
    });
    this.socketService
      .recieveCommunication()
      .subscribe((data: Communication) => {
        this.gameStateService.updateRevealedCommunication(data);
      });
  }
  get numberOfPlayers(): number {
    return this.gameStateService.numberOfPlayers;
  }
  get playerSummary(): Player[] {
    return this.gameStateService.playerSummary;
  }
  get revealedCommunications(): Communication[] {
    return this.gameStateService.revealedCommunications;
  }
  findPlayerBySeatOrder(positionFromCurrentPlayer: number): Player | undefined {
    return this.gameStateService.playerBySeatOrder(positionFromCurrentPlayer);
  }
  openTaskDealDialog(): void {
    const dialogRef = this.dialog.open(DealTaskDialogComponent);
    dialogRef.afterClosed().subscribe((options: TaskOptions) => {
      this.socketService.dealTaskCards(options);
    });
  }

  resolvePlayedCard(playedCard: PlayerCard): void {
    const { playedCards } = this;
    this.gameStateService.removePlayedCardFromCommunicationCards(playedCard);
    if (playedCards.length === 1) this.leadCard = playedCards[0];
    if (playedCards.length !== this.gameStateService.numberOfPlayers) return;
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
      const winningPlayer = this.gameStateService.playerSummary.find(
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
    handleCardDropEvent(event);
    const card = event.container.data[event.currentIndex];
    this.socketService.cardPlayed(card);
    this.resolvePlayedCard(card);
  }

  clearOldGameInfo(): void {
    this.gameStateService.revealedCommunications = [];
    this.leadCard = null;
    this.playedCards = [];
    this.lastTrick = [];
    this.winningCard = null;
  }

  playersTableText(player: Player | undefined): string {
    if (!player) return '';
    const displayName = this.playerDisplayName.transform(player);
    return `${displayName}: tricks ${player.tricks}`;
  }

  dealCards(): void {
    this.socketService.dealTheCards();
  }
}
