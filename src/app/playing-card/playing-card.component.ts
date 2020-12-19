import { Component, OnInit, Input } from '@angular/core';
import { Card } from '../types/game';

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.sass'],
})
export class PlayingCardComponent implements OnInit {
  @Input() card!: Card;
  @Input() showBackOfCard = false;
  imgUrl = '';
  cardStyleClass = '';

  ngOnInit(): void {
    this.cardStyleClass = this.showBackOfCard
      ? 'card-back'
      : `${this.card.suit}-card`;
    this.imgUrl = `/assets/${this.cardStyleClass}.jpg`;
  }
}
