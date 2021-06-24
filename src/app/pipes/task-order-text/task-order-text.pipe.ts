import { Pipe, PipeTransform } from '@angular/core';
import { TaskCard } from '../../types/game';

enum TaskSpecificOrder {
  First = 1,
  Second,
  Third,
  Fourth,
  Fifth,
}
enum TaskRelativeOrder {
  I = 1,
  II,
  III,
  IV,
}

@Pipe({
  name: 'taskOrderText',
})
export class TaskOrderTextPipe implements PipeTransform {
  transform(task: TaskCard): string {
    if (task.specificOrder) return TaskSpecificOrder[task.specificOrder];
    if (task.relativeOrder)
      return `Relative-${TaskRelativeOrder[task.relativeOrder]}`;
    return task.lastTask ? 'Last Task' : '';
  }
}
