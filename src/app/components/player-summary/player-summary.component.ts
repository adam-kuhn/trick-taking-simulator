import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { SocketService } from '../../services/socket.service';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { TaskCard, Player } from '../../types/game';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.sass'],
})
export class PlayerSummaryComponent {
  @Input() playerInfo!: Player;
  taskCards: TaskCard[] = [];
  constructor(
    private socketService: SocketService,
    private playerDisplayName: PlayerDisplayNamePipe
  ) {
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
}
