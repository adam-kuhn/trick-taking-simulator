import { Component, Input } from '@angular/core';
import { TaskCard } from '../types/game';

enum SpecificOrder {
  First = 1,
  Second,
  Third,
  Fourth,
  Fifth,
}
enum RelativeOrder {
  I = 1,
  II,
  III,
  IV,
}
@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: [
    '../game-room/game-room.component.sass',
    './task-selection.component.sass',
  ],
})
export class TaskSelectionComponent {
  @Input() startingTasks!: TaskCard[];
  @Input() showTasks!: boolean;
  getTaskText(task: TaskCard): string {
    if (task.specificOrder) return SpecificOrder[task.specificOrder];
    if (task.relativeOrder)
      return `Relative-${RelativeOrder[task.relativeOrder]}`;
    return task.lastTask ? 'Last Task' : '';
  }
}
