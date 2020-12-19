import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSelectionComponent } from './task-selection.component';

describe('TaskSelectionComponent', () => {
  let component: TaskSelectionComponent;
  let fixture: ComponentFixture<TaskSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
