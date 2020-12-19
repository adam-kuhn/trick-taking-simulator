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
    this.cardStyleClass = `${this.card.suit}-card`;
    this.imgUrl = `/assets/${
      this.showBackOfCard ? 'card-back' : this.cardStyleClass
    }.jpg`;
  }
}
