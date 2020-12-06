import { Component, OnInit, Input } from '@angular/core';
import { PlayerCard } from '../types/game';

@Component({
  selector: 'app-playing-card',
  templateUrl: './playing-card.component.html',
  styleUrls: ['./playing-card.component.sass'],
})
export class PlayingCardComponent implements OnInit {
  @Input() card!: PlayerCard;
  imgUrl = '';
  cardStyleClass = '';

  ngOnInit(): void {
    this.cardStyleClass = `${this.card.suit}-card`;
    this.imgUrl = `/assets/${this.cardStyleClass}.jpg`;
  }
}
