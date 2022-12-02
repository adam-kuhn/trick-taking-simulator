import { Component, Inject } from '@angular/core';
import {
  FormControl,
  AbstractControl,
  FormGroup,
  Validators,
  ValidatorFn,
  FormBuilder,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

export const createGameCode = (): string => {
  /* stupid simple password to enter the game this is just
  to prevent randoms for joining the game and is not meant to be secure
  TODO: individual rooms in progress - delete this soon */
  const now = new Date();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  const gameCode = `${date}-${month}_going-to-space`;
  // log the code in the console, so I don't have to remember the password :)
  console.log('Your game code is:', gameCode);
  return gameCode;
};

@Component({
  selector: 'app-join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['../shared-styles/dialog.sass'],
})
export class JoinGameDialogComponent {
  rooms: Record<string, string> = {};
  gameInfo: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { rooms: Record<string, string> },
    private formBuilder: FormBuilder
  ) {
    this.rooms = data.rooms;
    this.gameInfo = this.formBuilder.group({
      roomCredentials: this.formBuilder.group(
        {
          gameRoom: new FormControl('', Validators.required),
          gameCode: new FormControl('', [Validators.required]),
        },
        { validators: this.myvalidate }
      ),
      username: new FormControl('', [
        Validators.maxLength(15),
        Validators.pattern('(?=[^a-zA-Z0-9]*[a-zA-Z0-9])[a-zA-Z0-9\\s]*'),
      ]),
    });
  }

  get roomNames(): string[] {
    return Object.keys(this.rooms);
  }

  get gameCode(): AbstractControl | null {
    return this.gameInfo.get('roomCredentials.gameCode');
  }

  get roomCredentials(): AbstractControl | null {
    return this.gameInfo.get('roomCredentials');
  }

  get username(): AbstractControl | null {
    return this.gameInfo.get('username');
  }
  myvalidate: ValidatorFn = (formGroup: AbstractControl) => {
    const formCode = formGroup.get('gameCode')?.value;
    const formName = formGroup.get('gameRoom')?.value;
    if (this.rooms[formName] === formCode) {
      return null;
    }
    return { invalidCode: true };
  };
}
