import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Card } from '../types/game';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  providers: [GameService],
})
export class GameRoomComponent {
  cardsHaveBeenDealt = false;
  cardsInHand: Card[] = [];
  constructor(private gameService: GameService) {}
  async dealCards() {
    this.cardsInHand = await this.gameService.dealTheCards().toPromise();

    this.cardsHaveBeenDealt = true;
  }
}
