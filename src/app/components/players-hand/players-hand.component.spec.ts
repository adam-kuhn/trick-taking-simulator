import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { PlayersHandComponent } from './players-hand.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { CommunicationPositionPipe } from 'src/app/pipes/communication-position/communication-position.pipe';

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
});
