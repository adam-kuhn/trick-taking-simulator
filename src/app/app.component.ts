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
  styleUrls: [
    './app.component.sass',
    './components/snackbar/snackbar.component.sass',
  ],
})
export class AppComponent implements OnInit {
  title = 'trick-taking-simulator';
  inGame = false;
  // set default to above player limit, so button is disabled
  // until connections request comes back
  connectedClients = 6;
  requestConnections = 0;
  gameRooms: Record<string, string> = {};

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
        duration: 100000,
        panelClass: ['snackbar-container-success'],
      });
    });
    this.socketService.createRoomFailed().subscribe((data) => {
      this.snackbar.openFromComponent(SnackbarComponent, {
        data: {
          message: `Room creation failed: ${data.reason}`,
          success: false,
        },
        duration: 100000,
        panelClass: ['snackbar-container-error'],
      });
    });
  }

  async ngOnInit(): Promise<void> {
    this.requestConnections = window.setInterval(async () => {
      await this.getConnections();
      /* TODO: move this to only
      make the call when the join dialog is opened */
      this.getGameRooms();
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

  async getGameRooms(): Promise<void> {
    try {
      const { data } = await axios.get(`${environment.backEndUrl}/rooms`);
      this.gameRooms = data.rooms;
    } catch (error) {
      console.error('Oops, something went wrong!', error.message);
    }
  }

  joinGame(): void {
    this.inGame = true;
    window.clearInterval(this.requestConnections);
  }
  openJoinGameDialog(): void {
    // also need to limit the number of people in a room
    // can show the number of players currently in the room when trying to join
    const dialogRef = this.dialog.open(JoinGameDialogComponent, {
      data: {
        rooms: this.gameRooms,
      },
    });
    dialogRef.afterClosed().subscribe((gameInfo: FormGroup | undefined) => {
      if (gameInfo && gameInfo.value) {
        this.socketService.updatePlayerName(gameInfo.value.username);
      }
    });
  }
  openCreateRoomDialog(): void {
    /*TODO: after creating a room you should join
    it automatically or have another dialog
    that asks "join new room" */

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
