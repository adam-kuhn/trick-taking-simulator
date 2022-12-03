import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationPositionPipe } from 'src/app/pipes/communication-position/communication-position.pipe';
import { CommunicationZoneComponent } from './communication-zone.component';
import { Suits } from '../../types/game';
import { MatSelectChange } from '@angular/material/select';
import { SocketService } from 'src/app/services/socket.service';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';

describe('CommunicationZoneComponent', () => {
  let component: CommunicationZoneComponent;
  let fixture: ComponentFixture<CommunicationZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CommunicationZoneComponent, CommunicationPositionPipe],
      providers: [CommunicationPositionPipe, SocketService],
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

  describe('communication validation', () => {
    let sendCommunicationSpy: jasmine.Spy;
    // NOTE: communicated card is not in the players hand
    const communicationCard = {
      suit: Suits.Pink,
      value: 2,
      playerPosition: 1,
      username: USERNAME_ONE,
      type: 'lowest',
    };
    beforeEach(() => {
      const socketService = fixture.debugElement.injector.get(SocketService);
      sendCommunicationSpy = spyOn(socketService, 'sendCommunication');
      component.communicationCard = [communicationCard];
    });
    it('prevents only communication when not valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 3,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'only' } as MatSelectChange);
      expect(sendCommunicationSpy).not.toHaveBeenCalled();
    });
    it('prevents highest communication when not valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 3,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'highest' } as MatSelectChange);
      expect(sendCommunicationSpy).not.toHaveBeenCalled();
    });
    it('prevents lowest communication when not valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'lowest' } as MatSelectChange);
      expect(sendCommunicationSpy).not.toHaveBeenCalled();
    });

    it('allows lowest communication when valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 3,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'lowest' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });

    it('allows highest communication when valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'highest' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });

    it('allows only communication when valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Green,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];
      component.handleCommunication({ value: 'only' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });
    it('prevents unknown communication when not valid', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 3,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
        {
          suit: Suits.Pink,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'unknown' } as MatSelectChange);
      expect(sendCommunicationSpy).not.toHaveBeenCalled();
    });

    it('allows unknown communication when valid - lowest', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 3,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'unknown' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });

    it('allows unknown communication when valid - highest', () => {
      component.cardsInHand = [
        {
          suit: Suits.Pink,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];

      component.handleCommunication({ value: 'unknown' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });

    it('allows unknown communication when valid - only', () => {
      component.cardsInHand = [
        {
          suit: Suits.Green,
          value: 1,
          playerPosition: 1,
          username: USERNAME_ONE,
        },
      ];
      component.handleCommunication({ value: 'unknown' } as MatSelectChange);
      expect(sendCommunicationSpy).toHaveBeenCalled();
    });
  });
});
