import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';

interface ConnectionResponse {
  connections: number;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'trick-taking-simulator';
  inGame = false;
  // set default to player limit, so button is disabled
  // until connections request comes back
  connectedClients = 5;
  requestConnections = 0;
  gameCode = '';
  private validGameCode = '';

  async ngOnInit(): Promise<void> {
    this.requestConnections = window.setInterval(async () => {
      await this.getConnections();
    }, 1000);
    this.createGameCode();
  }

  async getConnections(): Promise<void> {
    try {
      const { data } = await axios.get<ConnectionResponse>(
        `${environment.backEndUrl}/connections`
      );
      this.connectedClients = data.connections;
    } catch (error) {
      console.error('Oops, something went wrong!', error.message);
    }
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
  setGameCode(event: Event): void {
    this.gameCode = (event?.target as HTMLInputElement).value;
  }
  isGameCodeValid(): boolean {
    return this.gameCode === this.validGameCode;
  }
  joinGame(): void {
    this.inGame = true;
    window.clearInterval(this.requestConnections);
  }
}
