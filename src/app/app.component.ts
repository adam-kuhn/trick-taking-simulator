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
  connectedClients = 0;

  async ngOnInit(): Promise<void> {
    await this.getConnections();
  }

  async getConnections(): Promise<void> {
    const { data } = await axios.get<ConnectionResponse>(
      `${environment.backEndUrl}/connections`
    );
    this.connectedClients = data.connections;
  }

  joinGame(): void {
    this.inGame = true;
  }
}
