import { Component } from '@angular/core';
import { GameService } from '../services/game.service';
import { GameState, PlayerCard } from '../types/game';
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
  cardsInHand: PlayerCard[] = [];
  playedCards: PlayerCard[] = [];
  lastTrick: PlayerCard[] = [];
  winningCard: PlayerCard | null = null;
  leadSuit = '';
  numberOfPlayers = 0;
  player = 0;

  constructor(private gameService: GameService) {
    this.gameService.recieveStartingCards().subscribe((data: GameState) => {
      this.numberOfPlayers = data.numberOfPlayers;
      this.cardsInHand = data.playersCards;
      this.player = data.player;
    });
    this.gameService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCards = [...this.playedCards, data];
      this.resolvePlayedCard();
    });
  }
  dealCards(): void {
    this.gameService.dealTheCards();
  }
  resolvePlayedCard(): void {
    const { playedCards } = this;
    if (playedCards.length === 1) this.leadSuit = playedCards[0].suit;
    if (playedCards.length !== this.numberOfPlayers) return;
    this.resolveTrick();
  }
  resolveTrick(): void {
    const playedTrump = this.playedCards.filter(
      (card: PlayerCard) => card.suit === 'rocket'
    );

    if (playedTrump.length > 0) {
      playedTrump.sort((a, b) => a.value - b.value);
      this.winningCard = playedTrump[0];
    } else {
      const followedSuit = this.playedCards.filter(
        (card: PlayerCard) => card.suit === this.leadSuit
      );
      followedSuit.sort((a, b) => a.value - b.value);
      this.winningCard = followedSuit[0];
    }
    this.cleanUpTrick();
  }
  cleanUpTrick(): void {
    setTimeout(() => {
      this.lastTrick = [...this.playedCards];
      this.playedCards = [];
    }, 3000);
  }
  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
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
    this.resolvePlayedCard();
  }
}
