import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-join-game-dialog',
  templateUrl: './join-game-dialog.component.html',
  styleUrls: ['./join-game-dialog.component.sass'],
})
export class JoinGameDialogComponent implements OnInit {
  gameInfo = new FormGroup({
    gameCode: new FormControl(''),
    username: new FormControl(''),
  });
  validGameCode = '';

  ngOnInit(): void {
    this.createGameCode();
  }

  /* stupid simple password to enter the game this is just 
  to prevent randoms for joining the game and is not meant to be secure
  TODO: make game individual game rooms */
  createGameCode(): void {
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    this.validGameCode = `${date}-${month}_going-to-space`;
    // log the code in the console, so I don't have to remember the password :)
    console.log('Your game code is:', this.validGameCode);
  }
  isGameCodeValid(): boolean {
    console.log('val', this.gameInfo.value);
    return this.gameInfo.value.gameCode === this.validGameCode;
  }
}
