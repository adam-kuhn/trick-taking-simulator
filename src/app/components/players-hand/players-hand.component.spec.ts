import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayersHandComponent } from './players-hand.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { CommunicationPositionPipe } from 'src/app/pipes/communication-position/communication-position.pipe';
import { Suits } from '../../types/game';

describe('PlayersHandComponent', () => {
  let component: PlayersHandComponent;
  let fixture: ComponentFixture<PlayersHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayersHandComponent, CommunicationPositionPipe],
      imports: [MatDialogModule],
      providers: [PlayerDisplayNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersHandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sorts a hand of cards', function () {
    component.cardsInHand = [
      { suit: Suits.Blue, value: 5, playerPosition: 1, username: 'test user' },
      {
        suit: Suits.Violet,
        value: 2,
        playerPosition: 1,
        username: 'test user',
      },
      { suit: Suits.Blue, value: 1, playerPosition: 1, username: 'test user' },
      { suit: Suits.Pink, value: 9, playerPosition: 1, username: 'test user' },
      { suit: Suits.Green, value: 4, playerPosition: 1, username: 'test user' },
      {
        suit: Suits.Rocket,
        value: 3,
        playerPosition: 1,
        username: 'test user',
      },
      {
        suit: Suits.Violet,
        value: 3,
        playerPosition: 1,
        username: 'test user',
      },
      { suit: Suits.Pink, value: 5, playerPosition: 1, username: 'test user' },
      { suit: Suits.Blue, value: 2, playerPosition: 1, username: 'test user' },
    ];
    const expected = [
      { suit: Suits.Blue, value: 1, playerPosition: 1, username: 'test user' },
      { suit: Suits.Blue, value: 2, playerPosition: 1, username: 'test user' },
      { suit: Suits.Blue, value: 5, playerPosition: 1, username: 'test user' },
      { suit: Suits.Pink, value: 5, playerPosition: 1, username: 'test user' },
      { suit: Suits.Pink, value: 9, playerPosition: 1, username: 'test user' },
      { suit: Suits.Green, value: 4, playerPosition: 1, username: 'test user' },
      {
        suit: Suits.Violet,
        value: 2,
        playerPosition: 1,
        username: 'test user',
      },
      {
        suit: Suits.Violet,
        value: 3,
        playerPosition: 1,
        username: 'test user',
      },
      {
        suit: Suits.Rocket,
        value: 3,
        playerPosition: 1,
        username: 'test user',
      },
    ];
    component.sortHandOfCards();
    const actual = component.cardsInHand;
    expect(actual).toEqual(expected);
  });
});
