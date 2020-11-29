import { io } from 'socket.io-client/build/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PlayerCard, GameState } from '../types/game';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private socket = io(environment.ws_url);

  dealTheCards(): void {
    this.socket.emit('deal_cards');
  }

  cardPlayed(card: PlayerCard): void {
    this.socket.emit('played_card', card);
  }

  recievePlayedCard(): Observable<PlayerCard> {
    const observable = new Observable<PlayerCard>((observer) => {
      this.socket.on('played_card', (data: PlayerCard) => {
        observer.next(data);
        // In case of error, disconnect
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }

  recieveStartingCards(): Observable<GameState> {
    const observable = new Observable<GameState>((observer) => {
      this.socket.on('dealt_cards', (data: GameState) => {
        observer.next(data);
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }
}
