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
  it('swaps the order of tasks', () => {
    const tasks: TaskCard[] = [
      {
        playerPosition: 1,
        username: 'test-user',
        suit: 'green',
        value: 1,
        completed: false,
        specificOrder: 2,
      },
      {
        playerPosition: 2,
        username: '',
        suit: 'green',
        value: 2,
        completed: false,
        relativeOrder: 3,
      },
    ];
    component.tasksToEdit = tasks;
    component.tasks = [
      ...tasks,
      {
        playerPosition: 3,
        username: '',
        suit: 'yellow',
        value: 1,
        completed: false,
        relativeOrder: 2,
      },
    ];
    component.swapTasks();
    const [resultOne, resultTwo] = component.tasks;
    expect(resultOne.relativeOrder).toEqual(tasks[1].relativeOrder);
    expect(resultTwo.specificOrder).toEqual(tasks[0].specificOrder);
  });
  describe('getTaskOrder', () => {
    let task: TaskCard;
    beforeEach(() => {
      task = {
        playerPosition: 3,
        username: '',
        suit: 'yellow',
        value: 1,
        completed: false,
      };
    });
    it('gets the task order - specificOrder', () => {
      task = { ...task, specificOrder: 2 };
      const expected = { specificOrder: task.specificOrder };
      const actual = component.getTaskOrder(task);
      expect(actual).toEqual(expected);
    });
    it('gets the task order - relativeOrder', () => {
      task = { ...task, relativeOrder: 1 };
      const expected = { relativeOrder: task.relativeOrder };
      const actual = component.getTaskOrder(task);
      expect(actual).toEqual(expected);
    });
    it('gets the task order - lastTask', () => {
      task = { ...task, lastTask: true };
      const expected = { lastTask: task.lastTask };
      const actual = component.getTaskOrder(task);
      expect(actual).toEqual(expected);
    });
    it('gets the task order - no order', () => {
      const expected = {};
      const actual = component.getTaskOrder(task);
      expect(actual).toEqual(expected);
    });
  });
});
