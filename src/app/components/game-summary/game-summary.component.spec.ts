import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { Suits } from '../../types/game';
import { GameSummaryComponent } from './game-summary.component';

describe('GameSummaryComponent', () => {
  let component: GameSummaryComponent;
  let fixture: ComponentFixture<GameSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameSummaryComponent],
      providers: [PlayerDisplayNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should format information text based on the player who played the card', () => {
    const playedCard = {
      suit: Suits.Green,
      value: 2,
      playerPosition: 4,
      username: '',
    };
    const expected = 'Player 4';
    const actual = component.formatInformation(playedCard);
    expect(actual).toBe(expected);
  });

  it('should format information text based on the player who communicated the card', () => {
    const playedCard = {
      suit: Suits.Green,
      value: 2,
      playerPosition: 4,
      username: 'Custom User',
    };
    const communicationType = 'highest';
    const expected = "Custom User's highest";
    const actual = component.formatInformation(playedCard, communicationType);
    expect(actual).toBe(expected);
  });
});
