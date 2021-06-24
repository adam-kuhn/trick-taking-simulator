import { Component, Input } from '@angular/core';
import { InitialTasks, TaskCard, Player } from '../../types/game';
import { SocketService } from '../../services/socket.service';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
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

  constructor(
    private socketService: SocketService,
    private playerTaskList: PlayerTaskListPipe
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
}
