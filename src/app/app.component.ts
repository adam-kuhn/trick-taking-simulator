import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SocketService } from './services/socket.service';

import { environment } from '../environments/environment';
import { JoinGameDialogComponent } from './components/join-game-dialog/join-game-dialog.component';

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
  // set default to above player limit, so button is disabled
  // until connections request comes back
  connectedClients = 6;
  requestConnections = 0;

  constructor(private dialog: MatDialog, private socketService: SocketService) {
    this.socketService.playerNameUpdated().subscribe(() => {
      this.joinGame();
    });
  }

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
  openJoinGameDialog(): void {
    const dialogRef = this.dialog.open(JoinGameDialogComponent);
    dialogRef.afterClosed().subscribe((gameInfo: FormGroup | undefined) => {
      if (gameInfo && gameInfo.value) {
        this.socketService.updatePlayerName(gameInfo.value.username);
      }
    });
  }
}
