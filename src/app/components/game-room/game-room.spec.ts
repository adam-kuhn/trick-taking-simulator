import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';

import { MatDialogModule } from '@angular/material/dialog';
import { GameRoomComponent } from './game-room.component';
import { PlayerDisplayNamePipe } from '../../pipes/player-display-name/player-display-name.pipe';

describe('GameRoomComponent', () => {
  let component: GameRoomComponent;
  let fixture: ComponentFixture<GameRoomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameRoomComponent],
      imports: [DragDropModule, OverlayModule, MatDialogModule],
      providers: [PlayerDisplayNamePipe],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
