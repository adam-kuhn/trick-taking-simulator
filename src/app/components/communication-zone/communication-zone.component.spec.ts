import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationPositionPipe } from 'src/app/pipes/communication-position/communication-position.pipe';
import { CommunicationZoneComponent } from './communication-zone.component';
import { Suits } from '../../types/game';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';

describe('CommunicationZoneComponent', () => {
  let component: CommunicationZoneComponent;
  let fixture: ComponentFixture<CommunicationZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunicationZoneComponent, CommunicationPositionPipe],
      providers: [CommunicationPositionPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunicationZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should prevent dragging to players hand if they have communicated', () => {
    const communicationCard = {
      suit: Suits.Pink,
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
      suit: Suits.Pink,
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
