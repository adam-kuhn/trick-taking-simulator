import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InitialTasks, TaskCard, Player } from '../../types/game';
import { SocketService } from '../../services/socket.service';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
import {
  ConfirmDialogComponent,
  DialogActions,
  DialogData,
} from '../confirm-dialog/confirm-dialog.component';
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
  tasksToEdit: TaskCard[] = [];

  constructor(
    private socketService: SocketService,
    private playerTaskList: PlayerTaskListPipe,
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
  }

  canPlayerSeeTasks(commanderOnly: boolean): boolean {
    let showTasks = true;
    if (commanderOnly) {
      showTasks = this.isPlayerCommander;
    }
    return showTasks;
  }
  revealTasks(): void {
    this.revealOnlyToCommander = false;
    this.socketService.revealTasks();
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
        this.swapTasks();
      }
      this.tasksToEdit = [];
    });
  }
  swapTasks(): void {
    const [taskOne, taskTwo] = this.tasksToEdit;
    const taskOneOrder = this.getTaskOrder(taskOne);
    const taskTwoOrder = this.getTaskOrder(taskTwo);
    this.updateTaskInplace(
      taskOne,
      this.updateTaskCardOrdering(taskOne, taskTwoOrder)
    );
    this.updateTaskInplace(
      taskTwo,
      this.updateTaskCardOrdering(taskTwo, taskOneOrder)
    );
  }
  getTaskOrder(
    task: TaskCard
  ): { relativeOrder?: number; specificOrder?: number; lastTask?: boolean } {
    const { relativeOrder, specificOrder, lastTask } = task;
    if (relativeOrder) return { relativeOrder };
    if (specificOrder) return { specificOrder };
    if (lastTask) return { lastTask };
    return {};
  }
  updateTaskCardOrdering(
    task: TaskCard,
    ordering: Partial<TaskCard>
  ): TaskCard {
    return {
      suit: task.suit,
      value: task.value,
      playerPosition: task.playerPosition,
      username: task.username,
      completed: task.completed,
      ...ordering,
    };
  }

  updateTaskInplace(task: TaskCard, updatedTask: TaskCard): void {
    const taskIndex = this.tasks.indexOf(task);
    this.tasks.splice(taskIndex, 1, updatedTask);
  }
}
