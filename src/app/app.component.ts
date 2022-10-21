import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { SocketService } from './services/socket.service';

import { environment } from '../environments/environment';
import { JoinGameDialogComponent } from './components/join-game-dialog/join-game-dialog.component';
import { CreateRoomDialogComponent } from './components/create-room-dialog/create-room-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from './components/snackbar/snackbar.component';

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

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private socketService: SocketService
  ) {
    this.socketService.playerNameUpdated().subscribe(() => {
      this.joinGame();
    });
    this.socketService.createRoomSuccess().subscribe((data) => {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: {
          message: `Room ${data.roomName} created!`,
          success: true,
        },
      });
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
  openCreateRoomDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent);
    dialogRef.afterClosed().subscribe((room: FormGroup | undefined) => {
      if (room?.value) {
        this.socketService.createRoom({
          name: room.value.name,
          code: room.value.code,
        });
      }
    });
  }
}
