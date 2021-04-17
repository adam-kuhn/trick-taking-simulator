import { Component, Inject } from '@angular/core';
import { PlayerCard } from '../types/game';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-acknowledge-dialog',
  templateUrl: './acknowledge-dialog.component.html',
  styleUrls: ['./acknowledge-dialog.component.sass'],
})
export class AcknowledgeDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { card?: PlayerCard; message: string }
  ) {}
}
