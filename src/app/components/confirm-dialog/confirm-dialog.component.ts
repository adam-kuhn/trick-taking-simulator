import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PlayerCard, TaskCard } from '../../types/game';

export enum DialogActions {
  CONFIRM,
  ACKNOWLEDGE,
  PLAYER_CHOICE,
}

export interface DialogData {
  message: string;
  card?: PlayerCard;
  taskCards?: TaskCard[];
  actions: DialogActions;
}
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.sass'],
})
export class ConfirmDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  get DialogActions(): typeof DialogActions {
    return DialogActions;
  }
}
