import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { GameRoomComponent } from './game-room.component';
import { PlayerDisplayNamePipe } from '../pipes/player-display-name/player-display-name.pipe';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameRoomComponent],
      imports: [DragDropModule, OverlayModule, MatDialogModule],
      providers: [PlayerDisplayNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should find the winning card, when all play the same suit', () => {
    const winningCard = {
      suit: 'green',
      value: 4,
      playerPosition: 4,
      username: '',
    };
    component.leadCard = {
      suit: 'green',
      value: 1,
      playerPosition: 1,
      username: '',
    };
    component.playedCards = [
      { suit: 'green', value: 1, playerPosition: 1, username: '' },
      { suit: 'green', value: 2, playerPosition: 2, username: '' },
      { suit: 'green', value: 3, playerPosition: 3, username: '' },
      { suit: 'green', value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    const actual = component.winningCard;
    expect(actual).toEqual(winningCard);
  });
  it('should find the winning card, when trump (a rocket) is played', () => {
    const winningCard = {
      suit: 'rocket',
      value: 1,
      playerPosition: 2,
      username: '',
    };
    component.leadCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: '',
    };
    component.playedCards = [
      { suit: 'pink', value: 1, playerPosition: 1, username: '' },
      { suit: 'rocket', value: 1, playerPosition: 2, username: '' },
      { suit: 'green', value: 3, playerPosition: 3, username: '' },
      { suit: 'green', value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    const actual = component.winningCard;
    expect(actual).toEqual(winningCard);
  });
  it("should find the winning card, when players can't follow the lead suit", () => {
    const winningCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: '',
    };
    component.leadCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: '',
    };
    component.playedCards = [
      { suit: 'pink', value: 1, playerPosition: 1, username: '' },
      { suit: 'green', value: 5, playerPosition: 2, username: '' },
      { suit: 'blue', value: 9, playerPosition: 3, username: '' },
      { suit: 'violet', value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    const actual = component.winningCard;
    expect(actual).toEqual(winningCard);
  });

  it('should prevent dragging to players hand if they have communicated', () => {
    const communicationCard = {
      suit: 'pink',
      value: 2,
      playerPosition: 1,
      username: '',
    };
    component.communicationCard = [communicationCard];
    component.revealedCommunications = [
      { type: 'highest', card: communicationCard },
      {
        type: 'lowest',
        card: { suit: 'green', value: 3, playerPosition: 2, username: '' },
      },
    ];
    const expected = 'playing-mat';
    const actual = component.communicationDragTo();
    expect(actual).toBe(expected);
  });

  it('should allow dragging to players hand if they have not communicated', () => {
    const communicationCard = {
      suit: 'pink',
      value: 2,
      playerPosition: 1,
      username: '',
    };
    component.communicationCard = [communicationCard];
    component.revealedCommunications = [
      {
        type: 'lowest',
        card: { suit: 'green', value: 3, playerPosition: 2, username: '' },
      },
    ];
    const expected = ['playing-mat', 'players-hand'];
    const actual = component.communicationDragTo();
    expect(actual).toEqual(expected);
  });
});
