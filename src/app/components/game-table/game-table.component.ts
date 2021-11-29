import { Component } from '@angular/core';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { SocketService } from '../../services/socket.service';
import { SharedGameStateService } from '../../services/shared-game-state.service';
import { PlayerCard, Player, TaskCard, Suits } from '../../types/game';

export interface CompleteTrick {
  trick: PlayerCard[];
  winningCard: PlayerCard;
}

@Component({
  selector: 'app-game-table',
  templateUrl: './game-table.component.html',
  styleUrls: ['./game-table.component.sass'],
})
export class GameTableComponent {
  playedCardsOtherPlayers: PlayerCard[] = [];
  playedCardCurrentPlayer: PlayerCard[] = [];
  isItCurrentPlayersTurn = false;
  get leadCard(): PlayerCard | null {
    return this.gameStateService.leadCard;
  }
  get cardPlayedToTheLeft(): PlayerCard | undefined {
    return this.getCardByPlayerPosition(this.playerToTheLeft);
  }
  get cardPlayedToTheRight(): PlayerCard | undefined {
    return this.getCardByPlayerPosition(this.playerToTheRight);
  }
  get cardPlayedTwoToTheLeft(): PlayerCard | undefined {
    return this.getCardByPlayerPosition(this.playerTwoToTheLeft);
  }
  get cardPlayedThreeToTheLeft(): PlayerCard | undefined {
    return this.getCardByPlayerPosition(this.playerThreeToTheleft);
  }
  get tasks(): TaskCard[] {
    return this.gameStateService.tasks;
  }
  get numberOfPlayers(): number {
    return this.gameStateService.numberOfPlayers;
  }
  get playerToTheLeft(): Player | undefined {
    return this.gameStateService.playerToTheLeft;
  }
  get playerToTheRight(): Player | undefined {
    return this.gameStateService.playerToTheRight;
  }
  get playerTwoToTheLeft(): Player | undefined {
    return this.gameStateService.playerTwoToTheLeft;
  }
  get playerThreeToTheleft(): Player | undefined {
    return this.gameStateService.playerThreeToTheleft;
  }

  constructor(
    private socketService: SocketService,
    private gameStateService: SharedGameStateService
  ) {
    this.socketService.recieveStartingCards().subscribe(() => {
      this.playedCardsOtherPlayers = [];
      this.playedCardCurrentPlayer = [];
      this.isItCurrentPlayersTurn = this.gameStateService.isPlayerCommander;
    });
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      this.playedCardsOtherPlayers = [...this.playedCardsOtherPlayers, data];
      if (data.playerPosition === this.playerToTheRight?.playerPosition) {
        this.isItCurrentPlayersTurn = true;
      }
      this.resolvePlayedCard();
    });
  }

  resolveTrick(): void {
    const cardsInTrick = this.playedCardCurrentPlayer.concat(
      this.playedCardsOtherPlayers
    );
    const playedTrump = cardsInTrick.filter(
      (card: PlayerCard) => card.suit === Suits.Rocket
    );
    let winningCard: PlayerCard;
    if (playedTrump.length > 0) {
      playedTrump.sort((a, b) => b.value - a.value);
      winningCard = playedTrump[0];
    } else {
      const followedSuit = cardsInTrick.filter(
        (card: PlayerCard) => this.leadCard && this.leadCard.suit === card.suit
      );
      followedSuit.sort((a, b) => b.value - a.value);
      winningCard = followedSuit[0];
    }
    this.cleanUpTrick(winningCard);
  }

  cleanUpTrick(winningCard: PlayerCard): void {
    setTimeout(() => {
      this.gameStateService.completedTrick(
        this.playedCardCurrentPlayer.concat(this.playedCardsOtherPlayers),
        winningCard
      );
      this.playedCardsOtherPlayers = [];
      this.playedCardCurrentPlayer = [];
      this.gameStateService.leadCard = null;
      this.isItCurrentPlayersTurn = this.gameStateService.didCurrentPlayerWinTheTrick();
    }, 3000);
  }

  cardPlayed(event: CdkDragDrop<PlayerCard[]>): void {
    if (!this.isItCurrentPlayersTurn) return;
    const card = event.previousContainer.data[event.previousIndex];
    if (!this.playedCardIsLegal(card, event.previousContainer.data)) return;
    this.isItCurrentPlayersTurn = false;
    handleCardDropEvent<PlayerCard>(event);
    this.socketService.cardPlayed(card);
    this.resolvePlayedCard();
  }

  playedCardIsLegal(card: PlayerCard, playersHand: PlayerCard[]): boolean {
    if (this.leadCard === null) return true;
    const { suit: leadSuit } = this.leadCard;
    if (card.suit === leadSuit) return true;
    return !playersHand.some((cardInHand) => cardInHand.suit === leadSuit);
  }
  resolvePlayedCard(): void {
    const { playedCardCurrentPlayer, playedCardsOtherPlayers } = this;
    if (!this.leadCard) {
      this.setLeadCard();
    }
    if (
      playedCardsOtherPlayers.length + playedCardCurrentPlayer.length !==
      this.numberOfPlayers
    )
      return;
    this.resolveTrick();
  }

  setLeadCard(): void {
    const { playedCardCurrentPlayer, playedCardsOtherPlayers } = this;
    const playerCard = playedCardCurrentPlayer.length;
    const otherCards = playedCardsOtherPlayers.length;
    const currentPlayerHaslLead = playerCard === 1 && otherCards === 0;
    const leadCard = currentPlayerHaslLead
      ? playedCardCurrentPlayer[0]
      : playedCardsOtherPlayers[0];
    this.gameStateService.leadCard = leadCard;
  }

  getCardByPlayerPosition(player: Player | undefined): PlayerCard | undefined {
    return this.playedCardsOtherPlayers.find(
      (card) => card.playerPosition === player?.playerPosition
    );
  }
}
