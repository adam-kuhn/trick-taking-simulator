import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  InitialTasks,
  TaskCard,
  Player,
  SwappingTasks,
} from '../../types/game';
import { SocketService } from '../../services/socket.service';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
import {
  ConfirmDialogComponent,
  DialogActions,
  DialogData,
} from '../confirm-dialog/confirm-dialog.component';
import { SharedGameStateService } from 'src/app/services/shared-game-state.service';
@Component({
  selector: 'app-task-selection',
  templateUrl: './task-selection.component.html',
  styleUrls: ['./task-selection.component.sass'],
})
export class TaskSelectionComponent {
  get isPlayerCommander(): boolean {
    return this.gameStateService.isPlayerCommander;
  }
  get playerSummary(): Player[] {
    return this.gameStateService.playerSummary;
  }
  get tasks(): TaskCard[] {
    return this.gameStateService.tasks;
  }
  set tasks(value: TaskCard[]) {
    this.gameStateService.tasks = value;
  }
  showTasks = true;
  revealOnlyToCommander = false;
  tasksToEdit: TaskCard[] = [];

  constructor(
    private socketService: SocketService,
    private playerTaskList: PlayerTaskListPipe,
    private gameStateService: SharedGameStateService,
    private dialog: MatDialog
  ) {
    this.socketService.recieveAssignedTask().subscribe((data: TaskCard) => {
      this.tasks = this.tasks.filter(
        (task) => !(task.value === data.value && task.suit === data.suit)
      );
    });
    this.socketService.recieveTaskCards().subscribe((data: InitialTasks) => {
      this.tasks = data.taskCards;
      this.revealOnlyToCommander = data.revealOnlyToCommander;
      this.showTasks = this.canPlayerSeeTasks(data.revealOnlyToCommander);
    });
    this.socketService
      .recieveSwappedTaskRequirements()
      .subscribe((data: SwappingTasks) => {
        const { taskOne, taskTwo } = data;
        this.updateTaskInplace(taskOne);
        this.updateTaskInplace(taskTwo);
      });
  }

  canPlayerSeeTasks(commanderOnly: boolean): boolean {
    let showTasks = true;
    if (commanderOnly) {
      showTasks = this.isPlayerCommander;
    }
    return showTasks;
  }
  playerTaskLists(): string[] {
    return this.playerSummary.map((player) =>
      this.playerTaskList.transform(player)
    );
  }
  handleTaskSelect(task: TaskCard): void {
    if (this.tasksToEdit.includes(task)) {
      this.tasksToEdit = [];
      return;
    }
    this.tasksToEdit.push(task);
    this.confirmTaskSwap();
  }
  confirmTaskSwap(): void {
    if (this.tasksToEdit.length !== 2) return;
    const data: DialogData = {
      message: 'Swap the order requirement of these two tasks?',
      actions: DialogActions.CONFIRM,
      taskCards: this.tasksToEdit,
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data });
    dialogRef.afterClosed().subscribe((confirmation: string) => {
      if (confirmation === 'confirm') {
        const [taskOne, taskTwo] = this.tasksToEdit;
        this.socketService.swapTaskRequirements({ taskOne, taskTwo });
      }
      this.tasksToEdit = [];
    });
  }

  updateTaskInplace(updatedTask: TaskCard): void {
    const taskIndex = this.tasks.findIndex(
      (task) =>
        task.suit === updatedTask.suit && task.value === updatedTask.value
    );
    this.tasks.splice(taskIndex, 1, updatedTask);
  }
}
