import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player-summary',
  templateUrl: './player-summary.component.html',
  styleUrls: ['./player-summary.component.sass'],
})
export class PlayerSummaryComponent {
  @Input() playerInfo!: string;
}
