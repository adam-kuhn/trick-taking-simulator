import { Component, Input, OnChanges } from '@angular/core';
import { Card, PlayerCard } from '../types/game';

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.sass'],
})
export class PlayingCardComponent implements OnChanges {
  @Input() card!: Card | PlayerCard;
  @Input() showBackOfCard = false;
  @Input() smallCard = false;
  imgUrl = '';

  ngOnChanges(): void {
    const cardStyle = this.showBackOfCard
      ? 'card-back'
      : `${this.card.suit}-card`;
    this.imgUrl = `/assets/${cardStyle}.jpg`;
  }
}
