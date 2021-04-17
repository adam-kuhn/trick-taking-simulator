import { Component, Input } from '@angular/core';
import { PlayerCard } from '../types/game';

@Component({
  selector: 'app-acknowledge-dialog',
  templateUrl: './acknowledge-dialog.component.html',
  styleUrls: ['./acknowledge-dialog.component.sass'],
})
export class AcknowledgeDialogComponent {
  @Input() card: PlayerCard | null = null;
  @Input() message = '';
}
