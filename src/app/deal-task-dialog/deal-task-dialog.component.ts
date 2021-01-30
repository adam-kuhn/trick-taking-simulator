import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface TaskOptions {
  totalTasks: number;
  orderedTasks: number;
  relativeTasks: number;
  revealOnlyToCommander: boolean;
  lastCompletedTask: boolean;
}

const numberedOptions = (totalOptions: number) => [
  ...Array(totalOptions).keys(),
];

@Component({
  selector: 'app-deal-task-dialog',
  templateUrl: './deal-task-dialog.component.html',
  styleUrls: ['./deal-task-dialog.component.sass'],
})
export class DealTaskDialogComponent {
  options: number[] = numberedOptions(11);
  orderSpecificOptions: number[] = numberedOptions(6);
  relativeOptions: number[] = numberedOptions(5);
  taskRevealConfig: TaskOptions = {
    totalTasks: 0,
    orderedTasks: 0,
    relativeTasks: 0,
    lastCompletedTask: false,
    revealOnlyToCommander: false,
  };

  setTotalTasks(event: MatSelectChange): void {
    this.taskRevealConfig.totalTasks = event.value;
  }
  setOrderSpecificTasks(event: MatSelectChange): void {
    this.taskRevealConfig.orderedTasks = event.value;
  }
  setRelativeTasks(event: MatSelectChange): void {
    this.taskRevealConfig.relativeTasks = event.value;
  }
  setLastCompletedTask(event: MatCheckboxChange): void {
    this.taskRevealConfig.lastCompletedTask = event.checked;
  }
  setRevealToCommander(event: MatCheckboxChange): void {
    this.taskRevealConfig.revealOnlyToCommander = event.checked;
  }
}
