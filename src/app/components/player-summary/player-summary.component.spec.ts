import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationPositionPipe } from 'src/app/pipes/communication-position/communication-position.pipe';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
import { PlayerSummaryComponent } from './player-summary.component';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';

describe('PlayerSummaryComponent', () => {
  let component: PlayerSummaryComponent;
  let fixture: ComponentFixture<PlayerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PlayerSummaryComponent,
        PlayerTaskListPipe,
        CommunicationPositionPipe,
      ],
      providers: [PlayerDisplayNamePipe, PlayerTaskListPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSummaryComponent);
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
      type: 'lowest',
    };
    component.communicationCard = [communicationCard];
    component.cardCommunicated = true;
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
      type: 'lowest',
    };
    component.communicationCard = [communicationCard];
    const expected = ['playing-mat', 'players-hand'];
    const actual = component.communicationDragTo();
    expect(actual).toEqual(expected);
  });
});
