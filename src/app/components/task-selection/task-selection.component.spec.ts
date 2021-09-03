import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TaskSelectionComponent } from './task-selection.component';
import { PlayerTaskListPipe } from '../../pipes/player-task-list/player-task-list.pipe';
import { TaskCard } from '../../types/game';

describe('TaskSelectionComponent', () => {
  let component: TaskSelectionComponent;
  let fixture: ComponentFixture<TaskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskSelectionComponent],
      imports: [MatDialogModule],
      providers: [PlayerTaskListPipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('shows tasks to all players', () => {
    spyOnProperty(component, 'isPlayerCommander').and.returnValue(false);
    const actual = component.canPlayerSeeTasks(false);
    expect(actual).toEqual(true);
  });
  it('shows tasks to commander when it is commander only', () => {
    spyOnProperty(component, 'isPlayerCommander').and.returnValue(true);
    const actual = component.canPlayerSeeTasks(true);
    expect(actual).toEqual(true);
  });
  it('does not show tasks to all players who are not the commander, when it is commander only', () => {
    spyOnProperty(component, 'isPlayerCommander').and.returnValue(false);
    const actual = component.canPlayerSeeTasks(true);
    expect(actual).toEqual(false);
  });
  it('sets selected tasks', () => {
    const selectedTask: TaskCard = {
      playerPosition: 1,
      username: 'test-user',
      suit: 'green',
      value: 1,
      completed: false,
      specificOrder: 2,
    };
    component.handleTaskSelect(selectedTask);
    expect(component.tasksToEdit[0]).toEqual(selectedTask);
  });
  it('deselects a task that has been selected previously', () => {
    const selectedTask: TaskCard = {
      playerPosition: 1,
      username: 'test-user',
      suit: 'green',
      value: 1,
      completed: false,
      specificOrder: 2,
    };
    component.handleTaskSelect(selectedTask);
    component.handleTaskSelect(selectedTask);
    expect(component.tasksToEdit.length).toEqual(0);
  });
  it('changes a tasks requiremet', () => {
    const originalTask: TaskCard = {
      playerPosition: 0,
      username: 'test-user',
      suit: 'green',
      value: 1,
      completed: false,
      specificOrder: 2,
    };
    const updatedTask: TaskCard = {
      playerPosition: 0,
      username: '',
      suit: 'green',
      value: 1,
      completed: false,
      relativeOrder: 3,
    };
    component.tasks = [originalTask];
    component.updateTaskInplace(updatedTask);
    const actual = component.tasks[0];
    expect(actual).toEqual(updatedTask);
    expect(actual.specificOrder).toBeUndefined();
  });
});
