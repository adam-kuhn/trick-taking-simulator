import { Component } from '@angular/core';
import {
  FormControl,
  AbstractControl,
  FormGroup,
  Validators,
} from '@angular/forms';

const createGameCode = (): string => {
  /* stupid simple password to enter the game this is just 
  to prevent randoms for joining the game and is not meant to be secure
  TODO: make game individual game rooms */
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
  styleUrls: ['./join-game-dialog.component.sass'],
})
export class JoinGameDialogComponent {
  gameInfo = new FormGroup({
    gameCode: new FormControl('', [
      Validators.required,
      Validators.pattern(createGameCode()),
    ]),
    username: new FormControl('', [
      Validators.maxLength(15),
      Validators.pattern('(?=[^a-zA-Z0-9]*[a-zA-Z0-9])[a-zA-Z0-9\\s]*'),
    ]),
  });
  validGameCode = '';

  get gameCode(): AbstractControl | null {
    return this.gameInfo.get('gameCode');
  }

  get username(): AbstractControl | null {
    return this.gameInfo.get('username');
  }
}
