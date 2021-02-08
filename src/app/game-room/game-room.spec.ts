import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { GameRoomComponent } from './game-room.component';
import { GameService } from '../services/game.service';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameRoomComponent],
      imports: [DragDropModule, OverlayModule, MatDialogModule],
      providers: [GameService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should find the winning card, when all play the same suit', () => {
    const winningCard = { suit: 'green', value: 4, player: 4 };
    component.leadCard = { suit: 'green', value: 1, player: 1 };
    component.playedCards = [
      { suit: 'green', value: 1, player: 1 },
      { suit: 'green', value: 2, player: 2 },
      { suit: 'green', value: 3, player: 3 },
      { suit: 'green', value: 4, player: 4 },
    ];
    component.resolveTrick();
    expect(component.winningCard).toEqual(winningCard);
  });
  it('should find the winning card, when trump (a rocket) is played', () => {
    const winningCard = { suit: 'rocket', value: 1, player: 2 };
    component.leadCard = { suit: 'pink', value: 1, player: 1 };
    component.playedCards = [
      { suit: 'pink', value: 1, player: 1 },
      { suit: 'rocket', value: 1, player: 2 },
      { suit: 'green', value: 3, player: 3 },
      { suit: 'green', value: 4, player: 4 },
    ];
    component.resolveTrick();
    expect(component.winningCard).toEqual(winningCard);
  });
  it("should find the winning card, when players can't follow the lead suit", () => {
    const winningCard = { suit: 'pink', value: 1, player: 1 };
    component.leadCard = { suit: 'pink', value: 1, player: 1 };
    component.playedCards = [
      { suit: 'pink', value: 1, player: 1 },
      { suit: 'green', value: 5, player: 2 },
      { suit: 'blue', value: 9, player: 3 },
      { suit: 'yellow', value: 4, player: 4 },
    ];
    component.resolveTrick();
    expect(component.winningCard).toEqual(winningCard);
  });

  it('should prevent dragging to players hand if they have communicated', () => {
    const communicationCard = { suit: 'pink', value: 2, player: 1 };
    component.communicationCard = [communicationCard];
    component.revealedCommunications = [
      { type: 'highest', card: communicationCard },
      { type: 'lowest', card: { suit: 'green', value: 3, player: 2 } },
    ];
    const expected = 'playing-mat';
    const actual = component.communicationDragTo();
    expect(actual).toBe(expected);
  });

  it('should allow dragging to players hand if they have not communicated', () => {
    const communicationCard = { suit: 'pink', value: 2, player: 1 };
    component.communicationCard = [communicationCard];
    component.revealedCommunications = [
      { type: 'lowest', card: { suit: 'green', value: 3, player: 2 } },
    ];
    const expected = ['playing-mat', 'players-hand'];
    const actual = component.communicationDragTo();
    expect(actual).toEqual(expected);
  });
});
