import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import {
  JoinGameDialogComponent,
  createGameCode,
} from './join-game-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('JoinGameDialogComponent', () => {
  let component: JoinGameDialogComponent;
  let fixture: ComponentFixture<JoinGameDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JoinGameDialogComponent],
      imports: [
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSelectModule,
      ],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: { rooms: { roomOne: '123' } },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Allows usernames with alphanumeric characters and spaces', () => {
    const { username } = component.gameInfo.controls;
    username.setValue('Username Joe');
    expect(username.errors).toBeFalsy();
  });
  it('Prevents usernames longer than 15 characters', () => {
    const { username } = component.gameInfo.controls;
    username.setValue('This username is too long');
    expect(username.errors?.maxlength).toBeTruthy();
    expect(username.errors?.pattern).toBeFalsy();
  });
  it('Prevents usernames with only spaces', () => {
    const { username } = component.gameInfo.controls;
    username.setValue('  ');
    expect(username.errors?.maxlength).toBeFalsy();
    expect(username.errors?.pattern).toBeTruthy();
  });
  it('Prevents usernames with only special characters', () => {
    const { username } = component.gameInfo.controls;
    username.setValue('<Cool><Guy>');
    expect(username.errors?.maxlength).toBeFalsy();
    expect(username.errors?.pattern).toBeTruthy();
  });
  it('It allows username with at least one character', () => {
    const { username } = component.gameInfo.controls;
    username.setValue('   3  ');
    expect(username.errors).toBeNull();
  });
  it('Shows an error when game code is wrong', () => {
    const { gameCode } = component.gameInfo.controls;
    gameCode.setValue('wrong code');
    expect(gameCode.errors).toBeTruthy();
  });
  it('Allows correct game code', () => {
    const { gameCode } = component.gameInfo.controls;
    gameCode.setValue(createGameCode());
    expect(gameCode.errors).toBeFalsy();
  });
  it('Is invalid when form is empty', () => {
    expect(component.gameInfo.valid).toBeFalse();
    expect(component.gameInfo.invalid).toBeTrue();
  });
  it('Is invalid when there are errors', () => {
    const { gameCode, username } = component.gameInfo.controls;
    gameCode.setValue(createGameCode());
    username.setValue('!Invalid name!$');
    expect(component.gameInfo.valid).toBeFalse();
    expect(component.gameInfo.invalid).toBeTrue();
  });
  it('Is valid when game code is correct and no username entered', () => {
    const { gameCode } = component.gameInfo.controls;
    gameCode.setValue(createGameCode());
    expect(component.gameInfo.valid).toBeTrue();
    expect(component.gameInfo.invalid).toBeFalse();
  });
});
