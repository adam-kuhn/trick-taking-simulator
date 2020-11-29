import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { Card, GameState } from '../types/game';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-game-room',
  templateUrl: './game-room.component.html',
  styleUrls: ['./game-room.component.sass'],
  providers: [GameService],
})
export class GameRoomComponent {
  cardsInHand: Card[] = [];
  numberOfPlayers = 0;
  player = 0;

  constructor(private gameService: GameService) {
    this.gameService
      .recievePlayedCard()
      .subscribe(
        (data: Card) => (this.playedCards = [...this.playedCards, data])
      );
    this.gameService.recieveStartingCards().subscribe((data: GameState) => {
      this.numberOfPlayers = data.numberOfPlayers;
      this.cardsInHand = data.playersCards;
      this.player = data.player;
    });
  }
  dealCards(): void {
    this.gameService.dealTheCards();
  }
  resolveHand(): void {
    console.log('rESOLVE');
  }
  cardPlayed(event: CdkDragDrop<Card[]>): void {
    const {
      container: currentContainer,
      previousContainer,
      currentIndex,
      previousIndex,
    } = event;
    if (previousContainer === currentContainer) {
      moveItemInArray(currentContainer.data, previousIndex, currentIndex);
      return;
    }
    transferArrayItem(
      previousContainer.data,
      currentContainer.data,
      previousIndex,
      currentIndex
    );
    this.gameService.cardPlayed(currentContainer.data[currentIndex]);
  }
}
