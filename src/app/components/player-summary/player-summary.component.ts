import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

import { SocketService } from '../../services/socket.service';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { TaskCard, PlayerCard, Player, Communication } from '../../types/game';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { SharedGameStateService } from 'src/app/services/shared-game-state.service';

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.sass'],
})
export class PlayerSummaryComponent {
  @Input() playerInfo!: Player;
  @Input() orientation = 'landscape';
  @Input() communicationCard: Communication[] = [];

  taskCards: TaskCard[] = [];
  communicationOptions = ['unknown', 'highest', 'lowest', 'only'];
  recievedCommunicationInfo = '';
  cardCommunicated = false;
  constructor(
    private socketService: SocketService,
    private playerDisplayName: PlayerDisplayNamePipe,
    private sharedGameState: SharedGameStateService
  ) {
    this.socketService.recieveStartingCards().subscribe(() => {
      this.communicationCard = [];
      this.cardCommunicated = false;
      this.recievedCommunicationInfo = '';
    });
    this.socketService.recieveTaskCards().subscribe(() => {
      this.taskCards = [];
    });
    this.socketService.recieveAssignedTask().subscribe((data: TaskCard) => {
      if (data.playerPosition === this.playerInfo?.playerPosition) {
        this.taskCards = [...this.taskCards, data];
      }
    });
    this.socketService.recieveCompletedTask().subscribe((data: TaskCard) => {
      const completedTask = this.taskCards.find(
        (task) => task.suit === data.suit && task.value === data.value
      );
      if (!completedTask) return;
      completedTask.completed = data.completed;
    });
    this.socketService
      .recieveCommunication()
      .subscribe((data: Communication) => {
        if (data.playerPosition === this.playerInfo?.playerPosition) {
          this.communicationCard = [data];
        }
      });
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      const [communicationCard] = this.communicationCard;
      if (
        communicationCard?.suit === data.suit &&
        communicationCard?.value === data.value
      ) {
        this.communicationCard = [];
      }
    });
  }

  playersTableText(): string {
    if (!this.playerInfo) return '';
    const displayName = this.playerDisplayName.transform(this.playerInfo);
    return `${displayName}: tricks ${this.playerInfo.tricks}`;
  }
  taskSelected(event: CdkDragDrop<TaskCard[]>): void {
    handleCardDropEvent<TaskCard>(event);
    const card = event.container.data[event.currentIndex];
    card.playerPosition = this.playerInfo?.playerPosition ?? 0;
    this.socketService.assignTask(card);
  }
  completeTask(event: MatCheckboxChange, task: TaskCard): void {
    task.completed = event.checked;
    this.socketService.completeTask(task);
  }

  communicationDragTo(): string[] | string {
    const listsForDrag = ['playing-mat', 'players-hand'];
    return this.cardCommunicated ? listsForDrag[0] : listsForDrag;
  }

  handleCommunication(event: MatSelectChange): void {
    this.cardCommunicated = true;
    // disable DRAG into zone at this point
    this.socketService.sendCommunication({
      ...this.communicationCard[0],
      type: event.value,
    });
  }

  cardPlacedInCommunication(event: CdkDragDrop<PlayerCard[]>): void {
    if (this.communicationCard.length === 1) return;
    this.handleDrop(event);
  }
  handleDrop(event: CdkDragDrop<PlayerCard[]>): void {
    handleCardDropEvent<PlayerCard>(event);
  }
  isPlayerLocalPlayer(): boolean {
    return (
      this.sharedGameState.player?.playerPosition ===
      this.playerInfo.playerPosition
    );
  }
}
