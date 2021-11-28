import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { By } from '@angular/platform-browser';
import { GameTableComponent } from './game-table.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { createPlayerFixture } from '../../test-utils/fixtures';
import { Suits } from 'src/app/types/game';

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
      suit: Suits.Green,
      value: 4,
      playerPosition: 4,
      username: USERNAME_ONE,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: Suits.Green,
        value: 1,
        playerPosition: 1,
        username: USERNAME_TWO,
      },
    });
    component.playedCardsOtherPlayers = [
      {
        suit: Suits.Green,
        value: 1,
        playerPosition: 1,
        username: USERNAME_TWO,
      },
      { suit: Suits.Green, value: 2, playerPosition: 2, username: '' },
      { suit: Suits.Green, value: 3, playerPosition: 3, username: '' },
    ];
    component.playedCardCurrentPlayer = [winningCard];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  it('should find the winning card, when trump (a rocket) is played - other player wins', () => {
    const winningCard = {
      suit: Suits.Rocket,
      value: 1,
      playerPosition: 2,
      username: USERNAME_TWO,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: Suits.Pink,
        value: 1,
        playerPosition: 1,
        username: USERNAME_ONE,
      },
    });
    component.playedCardsOtherPlayers = [
      { suit: Suits.Pink, value: 1, playerPosition: 1, username: USERNAME_ONE },
      winningCard,
      { suit: Suits.Green, value: 3, playerPosition: 3, username: '' },
    ];
    component.playedCardCurrentPlayer = [
      { suit: Suits.Green, value: 4, playerPosition: 4, username: '' },
    ];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  it("should find the winning card, when players can't follow the lead suit - current play wins", () => {
    const winningCard = {
      suit: Suits.Pink,
      value: 1,
      playerPosition: 1,
      username: USERNAME_TWO,
    };
    Object.defineProperty(component, 'leadCard', {
      value: {
        suit: Suits.Pink,
        value: 1,
        playerPosition: 1,
        username: USERNAME_TWO,
      },
    });
    component.playedCardsOtherPlayers = [
      { suit: Suits.Green, value: 5, playerPosition: 2, username: '' },
      { suit: Suits.Blue, value: 9, playerPosition: 3, username: '' },
      { suit: Suits.Violet, value: 4, playerPosition: 4, username: '' },
    ];
    component.playedCardCurrentPlayer = [winningCard];
    component.resolveTrick();
    expect(component.cleanUpTrick).toHaveBeenCalledWith(winningCard);
  });
  describe('legal plays', () => {
    const leadCard = {
      suit: Suits.Blue,
      value: 5,
      playerPosition: 2,
      username: '',
    };

    it('forces a player to follow suit when they can', () => {
      spyOnProperty(component, 'leadCard').and.returnValue(leadCard);
      fixture.detectChanges();
      const playedCard = {
        suit: Suits.Green,
        value: 5,
        playerPosition: 2,
        username: '',
      };
      const cardsInPlayersHand = [
        { suit: Suits.Green, value: 5, playerPosition: 2, username: '' },
        { suit: Suits.Blue, value: 9, playerPosition: 2, username: '' },
        { suit: Suits.Violet, value: 4, playerPosition: 2, username: '' },
      ];
      const actual = component.playedCardIsLegal(
        playedCard,
        cardsInPlayersHand
      );
      expect(actual).toEqual(false);
    });
    it('allows a player to play any card as the lead card', () => {
      const playedCard = {
        suit: Suits.Green,
        value: 5,
        playerPosition: 2,
        username: '',
      };
      const cardsInPlayersHand = [
        { suit: Suits.Green, value: 5, playerPosition: 2, username: '' },
        { suit: Suits.Blue, value: 9, playerPosition: 2, username: '' },
        { suit: Suits.Violet, value: 4, playerPosition: 2, username: '' },
      ];
      const actual = component.playedCardIsLegal(
        playedCard,
        cardsInPlayersHand
      );
      expect(actual).toEqual(true);
    });
    it('allows a player to not follow suit when they can not do so', () => {
      spyOnProperty(component, 'leadCard').and.returnValue(leadCard);
      fixture.detectChanges();
      const playedCard = {
        suit: Suits.Green,
        value: 5,
        playerPosition: 2,
        username: '',
      };
      const cardsInPlayersHand = [
        { suit: Suits.Green, value: 5, playerPosition: 2, username: '' },
        { suit: Suits.Violet, value: 4, playerPosition: 2, username: '' },
      ];
      const actual = component.playedCardIsLegal(
        playedCard,
        cardsInPlayersHand
      );
      expect(actual).toEqual(true);
    });
  });
  describe('other players spots (does not include current player)', () => {
    it('renders 2 other players around the table', () => {
      const players = 3;
      spyOnProperty(component, 'numberOfPlayers').and.returnValue(players);
      spyOnProperty(component, 'playerToTheLeft').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerToTheRight').and.returnValue(
        createPlayerFixture()
      );

      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
    it('renders 3 other players around the table', () => {
      const players = 4;
      spyOnProperty(component, 'numberOfPlayers').and.returnValue(players);
      spyOnProperty(component, 'playerToTheLeft').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerToTheRight').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerTwoToTheLeft').and.returnValue(
        createPlayerFixture()
      );
      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
    it('renders 4 other players around the table', () => {
      const players = 5;
      spyOnProperty(component, 'numberOfPlayers').and.returnValue(players);
      spyOnProperty(component, 'playerToTheLeft').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerToTheRight').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerTwoToTheLeft').and.returnValue(
        createPlayerFixture()
      );
      spyOnProperty(component, 'playerThreeToTheleft').and.returnValue(
        createPlayerFixture()
      );
      fixture.detectChanges();
      const playerTableSpots = fixture.debugElement.queryAll(
        By.directive(PlayerSummaryStub)
      );
      expect(playerTableSpots.length).toEqual(players - 1);
    });
  });
});
