import { io } from 'socket.io-client/build/index';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

import { PlayerCard, TaskCard, GameState, InitialTasks } from '../types/game';
import { TaskOptions } from '../deal-task-dialog/deal-task-dialog.component';
import { environment } from '../../environments/environment';

/* socket communication is occuring outside
the Angular zone. Need to ensure the UI
updates by use ngZone.run() 
can use NgZone.isInAngularZone() to determine what is happening in the
Angular zone
*/

const socket = io(environment.ws_url);
@Injectable()
export class GameService {
  constructor(private ngZone: NgZone) {}
  private socket = socket;
  private createObservalble<T>(message: string): Observable<T> {
    const observable = new Observable<T>((observer) => {
      socket.on(message, (data: T) => {
        this.ngZone.run(() => observer.next(data));
        // In case of error, disconnect
        return () => socket.disconnect();
      });
    });
    return observable;
  }
  dealTheCards(): void {
    socket.emit('deal_cards');
  }
  dealTaskCards(options: TaskOptions): void {
    socket.emit('deal_task_cards', options);
  }

  cardPlayed(card: PlayerCard): void {
    socket.emit('played_card', card);
  }

  assignTask(card: TaskCard): void {
    socket.emit('assign_task', card);
  }

  completeTask(card: TaskCard): void {
    socket.emit('complete_task', card);
  }

  recievePlayedCard(): Observable<PlayerCard> {
    return this.createObservalble<PlayerCard>('played_card');
  }

  recieveStartingCards(): Observable<GameState> {
    return this.createObservalble<GameState>('dealt_cards');
  }

  recieveTaskCards(): Observable<InitialTasks> {
    return this.createObservalble<InitialTasks>('show_task_cards');
  }

  recieveAssignedTask(): Observable<TaskCard> {
    return this.createObservalble<TaskCard>('assign_task');
  }

  recieveCompletedTask(): Observable<TaskCard> {
    return this.createObservalble<TaskCard>('complete_task');
  }
}
