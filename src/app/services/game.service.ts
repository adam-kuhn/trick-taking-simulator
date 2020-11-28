import { Injectable } from '@angular/core';
import { WebSocketService } from './web-socket.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Card } from '../types/game';

@Injectable()
export class GameService {
  private baseUrl = 'api/cards';
  messages: Observable<string>;
  constructor(private http: HttpClient, private wsService: WebSocketService) {
    this.messages = wsService.messageRecieved();
  }

  dealTheCards(): Observable<Card[]> {
    return this.http
      .get<Card[]>(`${this.baseUrl}/deal`)
      .pipe(catchError(this.handleError));
  }

  sendMsg(msg: string): void {
    console.log('send', msg);
    this.wsService.sendMessage(msg);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}
