import { Component, Input } from '@angular/core';
import { Card } from '../types/game';

@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: [
    '../game-room/game-room.component.sass',
    './task-selection.component.sass',
  ],
})
export class TaskSelectionComponent {
  @Input() startingTasks!: Card[];
  @Input() showTasks!: boolean;
}
