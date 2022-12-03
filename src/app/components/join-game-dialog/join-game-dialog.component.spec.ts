import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { JoinGameDialogComponent } from './join-game-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

describe('JoinGameDialogComponent', () => {
  let component: JoinGameDialogComponent;
  let fixture: ComponentFixture<JoinGameDialogComponent>;
  const ROOM_NAME = 'game room 1';
  const ROOM_CODE = '1234';
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
          useValue: { rooms: { [ROOM_NAME]: ROOM_CODE } },
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
    const username = component.gameInfo.get('username');
    username?.setValue('Username Joe');
    expect(username?.errors).toBeFalsy();
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
    const credentialsGroup = component.gameInfo.get('roomCredentials');
    const gameCode = component.gameInfo.get('roomCredentials.gameCode');
    const gameRoom = component.gameInfo.get('roomCredentials.gameRoom');
    gameRoom?.setValue(ROOM_NAME);
    gameCode?.setValue('wrong code');
    expect(credentialsGroup?.errors).toBeTruthy();
  });
  it('Is valid when code input matches the roomm code', () => {
    component.rooms = { roomOne: '1234' };
    const gameCode = component.gameInfo.get('roomCredentials.gameCode');
    gameCode?.setValue(1234);
    expect(gameCode?.errors).toBeFalsy();
  });
  it('Is valid when code input does not match the roomm code', () => {
    component.rooms = { roomOne: '1234' };
    const gameCode = component.gameInfo.get('roomCredentials.gameCode');
    gameCode?.setValue('wrong code');
    expect(gameCode?.errors).toBeFalsy();
  });
  it('Is invalid when form is empty', () => {
    expect(component.gameInfo.valid).toBeFalse();
    expect(component.gameInfo.invalid).toBeTrue();
  });
  it('Form is INVALID when there are errors', () => {
    const { username } = component.gameInfo.controls;
    const submitButton = fixture.nativeElement.querySelector('button');
    console.log(component.gameInfo.status, submitButton);

    username.setValue('!Invalid name!$');
    expect(component.gameInfo.valid).toBeFalse();
    expect(component.gameInfo.invalid).toBeTrue();
    expect(component.gameInfo.status).toBe('INVALID');
  });
  it('Form is VALID when there are no errors', () => {
    const { username } = component.gameInfo.controls;
    const gameCode = component.gameInfo.get('roomCredentials.gameCode');
    const gameRoom = component.gameInfo.get('roomCredentials.gameRoom');
    const submitButton = fixture.nativeElement.querySelector('button');

    username.setValue('Joe Bloe');
    gameRoom?.setValue(ROOM_NAME);
    gameCode?.setValue(ROOM_CODE);
    console.log(component.gameInfo.status, submitButton);
    expect(component.gameInfo.status).toBe('VALID');
  });
});
