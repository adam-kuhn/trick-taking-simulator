import { Component, Input } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { handleCardDropEvent } from '../../utils/card-dragging';
import { PlayerCard, Player, Communication, Suits } from '../../types/game';
import { SocketService } from '../../services/socket.service';
import { CommunicationPositionPipe } from '../../pipes/communication-position/communication-position.pipe';
import { SharedGameStateService } from 'src/app/services/shared-game-state.service';

@Component({
  selector: 'app-communication-zone',
  templateUrl: './communication-zone.component.html',
  styleUrls: ['./communication-zone.component.sass'],
})
export class CommunicationZoneComponent {
  @Input() playerInfo!: Player;
  communicationCard: Communication[] = [];
  communicationOptions = ['unknown', 'highest', 'lowest', 'only'];
  cardCommunicated = false;
  constructor(
    private socketService: SocketService,
    private communicationPosition: CommunicationPositionPipe,
    private sharedGameState: SharedGameStateService
  ) {
    this.socketService.recieveStartingCards().subscribe(() => {
      this.communicationCard = [];
      this.cardCommunicated = false;
    });
    this.socketService
      .recieveCommunication()
      .subscribe((data: Communication) => {
        if (data.playerPosition === this.playerInfo?.playerPosition) {
          this.communicationCard = [data];
        }
      });
    this.socketService.recievePlayedCard().subscribe((data: PlayerCard) => {
      const [communicationCard] = this.communicationCard;
      if (
        communicationCard?.suit === data.suit &&
        communicationCard?.value === data.value
      ) {
        this.communicationCard = [];
      }
    });
  }

  getCommunicationPosition(): string {
    if (this.cardCommunicated) {
      return this.playerInfo.playerPosition + 'NO_DRAGGING_HERE';
    }
    return this.communicationPosition.transform(this.playerInfo);
  }
  communicationDragTo(): string[] | string {
    const listsForDrag = ['playing-mat', 'players-hand'];
    return this.cardCommunicated ? listsForDrag[0] : listsForDrag;
  }

  handleCommunication(event: MatSelectChange): void {
    this.cardCommunicated = true;

    if (this.validateCommunication(event.value)) {
      this.socketService.sendCommunication({
        ...this.communicationCard[0],
        type: event.value,
      });
    }
  }

  private validateCommunication(communcationOption: string): boolean {
    switch (communcationOption) {
      case 'highest':
        return true;
      case 'lowest':
        return false;
      case 'only':
        return false;
      case 'unknown':
        return false;
      default:
        throw new Error(
          `Communcation option ${communcationOption} is not recognized`
        );
    }
  }

  cardPlacedInCommunication(event: CdkDragDrop<PlayerCard[]>): void {
    const { previousContainer, previousIndex } = event;
    if (
      this.communicationCard.length === 1 ||
      previousContainer.data[previousIndex].suit === Suits.Rocket
    )
      return;
    handleCardDropEvent<PlayerCard>(event);
  }

  isPlayerLocalPlayer(): boolean {
    return (
      this.sharedGameState.player?.playerPosition ===
      this.playerInfo.playerPosition
    );
  }
}
