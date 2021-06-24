import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { SocketService } from '../../services/socket.service';
import { GameState, Communication, Player, PlayerCard } from '../../types/game';
import {
  DealTaskDialogComponent,
  TaskOptions,
} from '../deal-task-dialog/deal-task-dialog.component';
import { SharedGameStateService } from '../../services/shared-game-state.service';
@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.sass'],
  providers: [MatDialog],
})
export class GameRoomComponent {
  dealingCompleted = false;

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService,
    private dialog: MatDialog
  ) {
    this.socketService.recieveStartingCards().subscribe((data: GameState) => {
      this.gameStateService.handleStartingCards(data);
      this.dealingCompleted = true;
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
  get leadCard(): PlayerCard | null {
    return this.gameStateService.leadCard;
  }
  get winningCard(): PlayerCard | null {
    return this.gameStateService.winningCard;
  }
  get lastTrick(): PlayerCard[] {
    return this.gameStateService.lastTrick;
  }
  get playerSummary(): Player[] {
    return this.gameStateService.playerSummary;
  }
  get revealedCommunications(): Communication[] {
    return this.gameStateService.revealedCommunications;
  }
  get isPlayerCommander(): boolean {
    return this.gameStateService.isPlayerCommander;
  }
  get player(): Player | null {
    return this.gameStateService.player;
  }
  get playerToTheRight(): Player | undefined {
    return this.gameStateService.playerToTheRight;
  }
  get playerToTheLeft(): Player | undefined {
    return this.gameStateService.playerToTheLeft;
  }
  get playerThreeToTheRight(): Player | undefined {
    return this.gameStateService.playerThreeToTheRight;
  }
  get playerTwoToTheLeft(): Player | undefined {
    return this.gameStateService.playerTwoToTheLeft;
  }

  openTaskDealDialog(): void {
    const dialogRef = this.dialog.open(DealTaskDialogComponent);
    dialogRef.afterClosed().subscribe((options: TaskOptions) => {
      this.socketService.dealTaskCards(options);
    });
  }

  dealCards(): void {
    this.socketService.dealTheCards();
  }
}
