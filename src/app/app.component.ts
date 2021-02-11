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

  async ngOnInit(): Promise<void> {
    this.requestConnections = window.setInterval(async () => {
      await this.getConnections();
    }, 1000);
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

  joinGame(): void {
    this.inGame = true;
    window.clearInterval(this.requestConnections);
  }
}
