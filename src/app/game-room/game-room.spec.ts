import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { GameRoomComponent } from './game-room.component';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameRoomComponent],
      imports: [DragDropModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should find the winning card, when all play the same suit', () => {
    const winningCard = { suit: 'green', value: 4, player: 4 };
    component.leadSuit = 'green';
    component.playedCards = [
      { suit: 'green', value: 1, player: 1 },
      { suit: 'green', value: 2, player: 2 },
      { suit: 'green', value: 3, player: 3 },
      { suit: 'green', value: 4, player: 4 },
    ];
    component.resolveTrick();
    expect(component.winningCard).toEqual(winningCard);
  });
});
