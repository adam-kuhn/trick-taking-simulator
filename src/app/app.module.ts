import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { GameRoomComponent } from './game-room/game-room.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';

import { WebSocketService } from './services/web-socket.service';

@NgModule({
  declarations: [AppComponent, GameRoomComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    HttpClientModule,
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent],
})
export class AppModule {}
