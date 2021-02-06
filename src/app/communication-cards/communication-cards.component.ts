import { Component, Input } from '@angular/core';
import { Communication } from '../types/game';

@Component({
  selector: 'app-communication-cards',
  templateUrl: './communication-cards.component.html',
})
export class CommunicationCardsComponent {
  @Input() communication!: Communication;
}
