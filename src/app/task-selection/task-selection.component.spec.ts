import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSelectChange } from '@angular/material/select';
import { TaskSelectionComponent } from './task-selection.component';

describe('TaskSelectionComponent', () => {
  let component: TaskSelectionComponent;
  let fixture: ComponentFixture<TaskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskSelectionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('assign selected player to the correct task', () => {
    const selectedTask = {
      suit: 'green',
      value: 1,
      player: 0,
      completed: false,
    };
    component.tasks = [selectedTask];
    const matSelectEvent = { value: 3 } as MatSelectChange;
    const expected = { ...selectedTask, player: 3 };
    component.setTaskToPlayer(matSelectEvent, selectedTask);
    expect(component.tasks[0].player).toBe(expected.player);
  });
});
