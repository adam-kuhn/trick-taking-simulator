import { Component, Input } from '@angular/core';
import { InitialTasks, TaskCard, Player } from '../types/game';
import { MatSelectChange } from '@angular/material/select';
import { SocketService } from '../services/socket.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

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
  styleUrls: ['./task-selection.component.sass'],
})
export class TaskSelectionComponent {
  @Input() isPlayerCommander = false;
  @Input() playerSummary!: Player[];
  tasks: TaskCard[] = [];
  showTasks = true;
  revealOnlyToCommander = false;

  constructor(private socketService: SocketService) {
    this.socketService.recieveAssignedTask().subscribe((data: TaskCard) => {
      const assignedTask = this.tasks.find(
        (task) => task.suit === data.suit && task.value === data.value
      );
      if (!assignedTask) return;
      assignedTask.playerPosition = data.playerPosition;
    });

    this.socketService.recieveCompletedTask().subscribe((data: TaskCard) => {
      const completedTask = this.tasks.find(
        (task) => task.suit === data.suit && task.value === data.value
      );
      if (!completedTask) return;
      completedTask.completed = data.completed;
    });
    this.socketService.recieveTaskCards().subscribe((data: InitialTasks) => {
      this.tasks = data.taskCards;
      this.revealOnlyToCommander = data.revealOnlyToCommander;
      this.showTasks = this.canPlayerSeeTasks(data.revealOnlyToCommander);
    });
    this.socketService.revealTaskToPlayers().subscribe(() => {
      this.showTasks = true;
      this.revealOnlyToCommander = false;
    });
  }

  canPlayerSeeTasks(commanderOnly: boolean): boolean {
    let showTasks = true;
    if (commanderOnly) {
      showTasks = this.isPlayerCommander;
    }
    return showTasks;
  }
  // TODO move to pipe
  getTaskText(task: TaskCard): string {
    if (task.specificOrder) return SpecificOrder[task.specificOrder];
    if (task.relativeOrder)
      return `Relative-${RelativeOrder[task.relativeOrder]}`;
    return task.lastTask ? 'Last Task' : '';
  }
  setTaskToPlayer(event: MatSelectChange, selectedTask: TaskCard): void {
    const task = this.tasks.find(
      (task) =>
        task.suit === selectedTask.suit && task.value === selectedTask.value
    );
    if (!task) return;
    task.playerPosition = event.value;
    this.socketService.assignTask(task);
  }
  completeTask(event: MatCheckboxChange, task: TaskCard): void {
    task.completed = event.checked;
    this.socketService.completeTask(task);
  }
  revealTasks(): void {
    this.revealOnlyToCommander = false;
    this.socketService.revealTasks();
  }
}
