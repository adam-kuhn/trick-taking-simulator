import { Component, Input } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { TaskCard, Player } from '../../types/game';
import { PlayerDisplayNamePipe } from 'src/app/pipes/player-display-name/player-display-name.pipe';

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.sass'],
})
export class PlayerSummaryComponent {
  @Input() playerInfo!: Player | undefined;
  taskCards: TaskCard[] = [];
  constructor(private playerDisplayName: PlayerDisplayNamePipe) {}

  playersTableText(): string {
    if (!this.playerInfo) return '';
    const displayName = this.playerDisplayName.transform(this.playerInfo);
    return `${displayName}: tricks ${this.playerInfo.tricks}`;
  }
  taskSelected(event: CdkDragDrop<TaskCard[]>): void {
    handleCardDropEvent<TaskCard>(event);
    const card = event.container.data[event.currentIndex];
}
