import { Component, Input } from '@angular/core';
import { PlayerCard, TaskCard } from '../../types/game';

@Component({
  selector: 'app-information-card',
  templateUrl: './information-card.component.html',
  styleUrls: ['./information-card.component.sass'],
})
export class InformationCardsComponent {
  @Input() information!: string;
  @Input() card!: PlayerCard | TaskCard;
  @Input() showBackOfCard!: boolean;
  @Input() smallCard!: boolean;
  @Input() highlighted = false;
}
