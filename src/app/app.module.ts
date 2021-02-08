import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlayingCardComponent } from './playing-card/playing-card.component';
import { DealTaskDialogComponent } from './deal-task-dialog/deal-task-dialog.component';
import { TaskSelectionComponent } from './task-selection/task-selection.component';
import { InformationCardsComponent } from './communication-cards/information-card.component';
import { GameSummaryComponent } from './game-summary/game-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    GameRoomComponent,
    PlayingCardComponent,
    DealTaskDialogComponent,
    TaskSelectionComponent,
    InformationCardsComponent,
    GameSummaryComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    OverlayModule,
    MatDialogModule,
    MatCardModule,
    HttpClientModule,
    DragDropModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
