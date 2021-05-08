import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayersHandComponent } from './players-hand.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';

describe('PlayersHandComponent', () => {
  let component: PlayersHandComponent;
  let fixture: ComponentFixture<PlayersHandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayersHandComponent],
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

  it('should prevent dragging to players hand if they have communicated', () => {
    const communicationCard = {
      suit: 'pink',
      value: 2,
      playerPosition: 1,
      username: USERNAME_TWO,
    };
    component.communicationCard = [communicationCard];
    component.gameStateService.revealedCommunications = [
      { type: 'highest', card: communicationCard },
      {
        type: 'lowest',
        card: {
          suit: 'green',
          value: 3,
          playerPosition: 2,
          username: USERNAME_TWO,
        },
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
      username: USERNAME_ONE,
    };
    component.communicationCard = [communicationCard];
    component.gameStateService.revealedCommunications = [
      {
        type: 'lowest',
        card: {
          suit: 'green',
          value: 3,
          playerPosition: 2,
          username: USERNAME_ONE,
        },
      },
    ];
    const expected = ['playing-mat', 'players-hand'];
    const actual = component.communicationDragTo();
    expect(actual).toEqual(expected);
  });
});
