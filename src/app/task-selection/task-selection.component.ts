import { Component, Input } from '@angular/core';
import { Card } from '../types/game';

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
  @Input() startingTasks!: Card[];
  @Input() showTasks!: boolean;

  getTaskText(e: any): string {
    console.log(e);
    if (e.specificOrder) return SpecificOrder[e.specificOrder];
    if (e.relativeOrder) return `Relative-${RelativeOrder[e.relativeOrder]}`;
    return e.lastTask ? 'Last Task' : '';
  }
}
