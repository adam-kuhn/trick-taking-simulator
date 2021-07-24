import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskSelectionComponent } from './task-selection.component';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';

describe('TaskSelectionComponent', () => {
  let component: TaskSelectionComponent;
  let fixture: ComponentFixture<TaskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskSelectionComponent],
      providers: [PlayerTaskListPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectionComponent);
    component = fixture.componentInstance;
    component.playerSummary = [];
    fixture.detectChanges();
  });
  it('shows tasks to all players', () => {
    component.isPlayerCommander = false;
    const actual = component.canPlayerSeeTasks(false);
    expect(actual).toEqual(true);
  });
  it('shows tasks to commander when it is commander only', () => {
    component.isPlayerCommander = true;
    const actual = component.canPlayerSeeTasks(true);
    expect(actual).toEqual(true);
  });
  it('does not show tasks to all players who are not the commander, when it is commander only', () => {
    component.isPlayerCommander = false;
    const actual = component.canPlayerSeeTasks(true);
    expect(actual).toEqual(false);
  });
});
