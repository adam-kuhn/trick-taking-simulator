import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSummaryComponent } from './game-summary.component';

describe('GameSummaryComponent', () => {
  let component: GameSummaryComponent;
  let fixture: ComponentFixture<GameSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should format information text based on the player who played the card', () => {
    const playedCard = { suit: 'green', value: 2, player: 4 };
    const expected = 'Player 4';
    const actual = component.formatInformation(playedCard);
    expect(actual).toBe(expected);
  });

  it('should format information text based on the player who communicated the card', () => {
    const playedCard = { suit: 'green', value: 2, player: 4 };
    const communcationType = 'highest';
    const expected = "Player 4's highest";
    const actual = component.formatInformation(playedCard, communcationType);
    expect(actual).toBe(expected);
  });
});
