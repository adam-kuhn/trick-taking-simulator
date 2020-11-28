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
  message: string = ''
  constructor(private gameService: GameService) {

  }

  ngOnInit() {
    this.gameService.messages.subscribe(msg => {
      console.log("from game room", msg)
      this.message = msg;
    })
  }

  sendMessage() {
    console.log("CLICKED")
    this.gameService.sendMsg("MYfancyy new TEST")
  }
  async dealCards() {
    this.cardsInHand = await this.gameService.dealTheCards().toPromise();

    this.cardsHaveBeenDealt = true;
  }

}
