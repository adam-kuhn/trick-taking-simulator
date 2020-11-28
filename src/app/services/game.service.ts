import io from 'socket.io-client';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Card } from '../types/game';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private baseUrl = 'api/cards';
  // getting a compile error in console
  // about connect not being a function
  // not breaking anything at the moment
  private socket = io.connect(environment.ws_url);

  dealTheCards(): void {
    this.socket.emit('deal_cards');
  }

  recieveHandOfCards(): Observable<Card[]> {
    const observable = new Observable<Card[]>((observer) => {
      this.socket.on('dealt_cards', (data: Card[]) => {
        observer.next(data);
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }
}
