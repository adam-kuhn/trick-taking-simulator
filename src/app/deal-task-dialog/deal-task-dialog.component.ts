import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { MatCheckboxChange } from '@angular/material/checkbox';

export interface TaskOptions {
  numberOfTasks: number;
  revealOnlyToCommander: boolean;
}
@Component({
  selector: 'app-deal-task-dialog',
  templateUrl: './deal-task-dialog.component.html',
})
export class DealTaskDialogComponent {
  options: number[] = [...Array(11).keys()];
  taskRevealConfig: TaskOptions = {
    numberOfTasks: 0,
    revealOnlyToCommander: false,
  };

  setNumberOfTasks(event: MatSelectChange): void {
    this.taskRevealConfig.numberOfTasks = event.value;
  }
  setRevealToCommander(event: MatCheckboxChange): void {
    this.taskRevealConfig.revealOnlyToCommander = event.checked;
  }
}
