import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { GameRoomComponent } from './game-room.component';
import { PlayerDisplayNamePipe } from '../pipes/player-display-name/player-display-name.pipe';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';

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
      username: USERNAME_ONE,
    };
    component.leadCard = {
      suit: 'green',
      value: 1,
      playerPosition: 1,
      username: USERNAME_TWO,
    };
    component.playedCards = [
      { suit: 'green', value: 1, playerPosition: 1, username: USERNAME_TWO },
      { suit: 'green', value: 2, playerPosition: 2, username: '' },
      { suit: 'green', value: 3, playerPosition: 3, username: '' },
      { suit: 'green', value: 4, playerPosition: 4, username: USERNAME_ONE },
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
      username: USERNAME_TWO,
    };
    component.leadCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: USERNAME_ONE,
    };
    component.playedCards = [
      { suit: 'pink', value: 1, playerPosition: 1, username: USERNAME_ONE },
      { suit: 'rocket', value: 1, playerPosition: 2, username: USERNAME_TWO },
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
      username: USERNAME_TWO,
    };
    component.leadCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: USERNAME_TWO,
    };
    component.playedCards = [
      { suit: 'pink', value: 1, playerPosition: 1, username: USERNAME_TWO },
      { suit: 'green', value: 5, playerPosition: 2, username: '' },
      { suit: 'blue', value: 9, playerPosition: 3, username: '' },
      { suit: 'violet', value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    const actual = component.winningCard;
    expect(actual).toEqual(winningCard);
  });
});
