import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlayingCardComponent } from './playing-card/playing-card.component';
import { DealTaskDialogComponent } from './deal-task-dialog/deal-task-dialog.component';
import { TaskSelectionComponent } from './task-selection/task-selection.component';
import { InformationCardsComponent } from './communication-cards/information-card.component';
import { GameSummaryComponent } from './game-summary/game-summary.component';

import { SocketService } from './services/socket.service';
import { SharedGameStateService } from './services/shared-game-state.service';
import { JoinGameDialogComponent } from './join-game-dialog/join-game-dialog.component';
import { PlayerDisplayNamePipe } from './pipes/player-display-name/player-display-name.pipe';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PlayersHandComponent } from './players-hand/players-hand.component';

@NgModule({
  declarations: [
    AppComponent,
    GameRoomComponent,
    PlayingCardComponent,
    DealTaskDialogComponent,
    TaskSelectionComponent,
    InformationCardsComponent,
    GameSummaryComponent,
    JoinGameDialogComponent,
    PlayerDisplayNamePipe,
    ConfirmDialogComponent,
    PlayersHandComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    OverlayModule,
    MatDialogModule,
    HttpClientModule,
    DragDropModule,
    MatSelectModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  providers: [SocketService, SharedGameStateService, PlayerDisplayNamePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
