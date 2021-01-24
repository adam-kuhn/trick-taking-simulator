import { Component, Input, OnInit } from '@angular/core';
import { InitialTasks, TaskCard } from '../types/game';
import { MatSelectChange } from '@angular/material/select';
import { GameService } from '../services/game.service';
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
  styleUrls: [
    '../game-room/game-room.component.sass',
    './task-selection.component.sass',
  ],
  providers: [GameService],
})
export class TaskSelectionComponent implements OnInit {
  @Input() isPlayerCommander = false;
  @Input() numberOfPlayers!: number;
  tasks: TaskCard[] = [];
  players: number[] = [];
  showTasks = true;
  revealOnlyToCommander = false;

  constructor(private gameService: GameService) {
    this.gameService.recieveAssignedTask().subscribe((data: TaskCard) => {
      const assignedTask = this.tasks.find(
        (task) => task.suit === data.suit && task.value === data.value
      );
      if (!assignedTask) return;
      assignedTask.player = data.player;
    });

    this.gameService.recieveCompletedTask().subscribe((data: TaskCard) => {
      const completedTask = this.tasks.find(
        (task) => task.suit === data.suit && task.value === data.value
      );
      if (!completedTask) return;
      completedTask.completed = data.completed;
    });
    this.gameService.recieveTaskCards().subscribe((data: InitialTasks) => {
      this.tasks = data.taskCards;
      this.revealOnlyToCommander = data.revealOnlyToCommander;
      this.showTasks = this.canPlayerSeeTasks(data.revealOnlyToCommander);
    });
    this.gameService.revealTaskToPlayers().subscribe(() => {
      this.showTasks = true;
      this.revealOnlyToCommander = false;
    });
  }

  ngOnInit(): void {
    for (let i = 1; i <= this.numberOfPlayers; i++) {
      this.players.push(i);
    }
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
    task.player = event.value;
    this.gameService.assignTask(task);
  }
  completeTask(event: MatCheckboxChange, task: TaskCard): void {
    task.completed = event.checked;
    this.gameService.completeTask(task);
  }
  revealTasks(): void {
    this.revealOnlyToCommander = false;
    this.gameService.revealTasks();
  }
}
