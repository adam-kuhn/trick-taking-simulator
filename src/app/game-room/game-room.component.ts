import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Card } from '../types/game';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  providers: [GameService],
})
export class GameRoomComponent {
  cardsInHand: Card[] = [];
  constructor(private gameService: GameService) {
    this.gameService
      .recieveHandOfCards()
      .subscribe((data) => (this.cardsInHand = data));
  }
  dealCards(): void {
    this.gameService.dealTheCards();
  }
}
