import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
import { PlayerSummaryComponent } from './player-summary.component';

describe('PlayerSummaryComponent', () => {
  let component: PlayerSummaryComponent;
  let fixture: ComponentFixture<PlayerSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerSummaryComponent, PlayerTaskListPipe],
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
});
