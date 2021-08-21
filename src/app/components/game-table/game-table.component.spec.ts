import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { GameTableComponent } from './game-table.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { createPlayerFixture } from '../../test-utils/fixtures';

const USERNAME_ONE = 'Custom name 1';
const USERNAME_TWO = 'Custom name 2';
@Component({
  selector: 'app-player-summary',
  template: '',
})
class PlayerSummaryStub {}

describe('GameTableComponent', () => {
  let component: GameTableComponent;
  let fixture: ComponentFixture<GameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameTableComponent, PlayerSummaryStub],
      imports: [DragDropModule],
      providers: [PlayerDisplayNamePipe],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(GameTableComponent);
    component = fixture.componentInstance;
    spyOn(component, 'cleanUpTrick');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should find the winning card, when all play the same suit - current player wins', () => {
    const winningCard = {
      suit: 'green',
      value: 4,
      playerPosition: 4,
      username: USERNAME_ONE,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: 'green',
        value: 1,
        playerPosition: 1,
        username: USERNAME_TWO,
      },
    });
    component.playedCardsOtherPlayers = [
      { suit: 'green', value: 1, playerPosition: 1, username: USERNAME_TWO },
      { suit: 'green', value: 2, playerPosition: 2, username: '' },
      { suit: 'green', value: 3, playerPosition: 3, username: '' },
    ];
    component.playedCardCurrentPlayer = [winningCard];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  it('should find the winning card, when trump (a rocket) is played - other player wins', () => {
    const winningCard = {
      suit: 'rocket',
      value: 1,
      playerPosition: 2,
      username: USERNAME_TWO,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: 'pink',
        value: 1,
        playerPosition: 1,
        username: USERNAME_ONE,
      },
    });
    component.playedCardsOtherPlayers = [
      { suit: 'pink', value: 1, playerPosition: 1, username: USERNAME_ONE },
      winningCard,
      { suit: 'green', value: 3, playerPosition: 3, username: '' },
    ];
    component.playedCardCurrentPlayer = [
      { suit: 'green', value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  it("should find the winning card, when players can't follow the lead suit - current play wins", () => {
    const winningCard = {
      suit: 'pink',
      value: 1,
      playerPosition: 1,
      username: USERNAME_TWO,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: 'pink',
        value: 1,
        playerPosition: 1,
        username: USERNAME_TWO,
      },
    });
    component.playedCardsOtherPlayers = [
      { suit: 'green', value: 5, playerPosition: 2, username: '' },
      { suit: 'blue', value: 9, playerPosition: 3, username: '' },
      { suit: 'violet', value: 4, playerPosition: 4, username: '' },
    ];
    component.playedCardCurrentPlayer = [winningCard];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  describe('other players spots (does not include current player)', () => {
    afterEach(() => {
      component.playerToTheLeft = undefined;
      component.playerToTheRight = undefined;
      component.playerTwoToTheLeft = undefined;
      component.playerThreeToTheleft = undefined;
    });
    it('renders 2 other players around the table', () => {
      const players = 3;
      component.numberOfPlayers = players;
      component.playerToTheLeft = createPlayerFixture();
      component.playerToTheRight = createPlayerFixture();
      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
    it('renders 3 other players around the table', () => {
      const players = 4;
      component.numberOfPlayers = players;
      component.playerToTheLeft = createPlayerFixture();
      component.playerToTheRight = createPlayerFixture();
      component.playerTwoToTheLeft = createPlayerFixture();
      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
    it('renders 4 other players around the table', () => {
      const players = 5;

      component.numberOfPlayers = players;
      component.playerToTheLeft = createPlayerFixture();
      component.playerToTheRight = createPlayerFixture();
      component.playerTwoToTheLeft = createPlayerFixture();
      component.playerThreeToTheleft = createPlayerFixture();
      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
  });
});
