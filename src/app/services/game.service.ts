import { io } from 'socket.io-client/build/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  PlayerCard,
  TaskCard,
  GameState,
  InitialTasks,
  Communication,
} from '../types/game';
import { TaskOptions } from '../deal-task-dialog/deal-task-dialog.component';
import { environment } from '../../environments/environment';

/* NOTE TO SELF
I was originally injecting this service at the component level. Doing so created two instances
of this service. Because of this when I had the socket initiated as a property of the class
I was creating multiple socket connections per user. My workaround was to use ngZone and define
the socket outside the service
const socket = io(environment.ws_url)
and then assign this to a property on my service. This method required ngZone because the socket
was defined outside of the "Angular Zone" and therefore Angular would not trigger updates when there
was socket communication. I then forced Angular to update by using ngZone.run()
Setting this service to be provided in the root module, makes it so only one service is created
and is accessible by all components in that module. Therefore only one socket per client is created
and updates occur without the need of ngZone
*/
@Injectable({ providedIn: 'root' })
export class GameService {
  private socket = io(environment.backEndUrl);
  private createObservalble<T>(message: string): Observable<T> {
    const observable = new Observable<T>((observer) => {
      this.socket.on(message, (data: T) => {
        observer.next(data);
        // In case of error, disconnect
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }
  dealTheCards(): void {
    this.socket.emit('deal_cards');
  }

  dealTaskCards(options: TaskOptions): void {
    this.socket.emit('deal_task_cards', options);
  }

  cardPlayed(card: PlayerCard): void {
    this.socket.emit('played_card', card);
  }

  assignTask(card: TaskCard): void {
    this.socket.emit('assign_task', card);
  }

  completeTask(card: TaskCard): void {
    this.socket.emit('complete_task', card);
  }

  revealTasks(): void {
    this.socket.emit('reveal_tasks');
  }

  sendCommunication(data: Communication): void {
    this.socket.emit('communicate', data);
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

  revealTaskToPlayers(): Observable<null> {
    return this.createObservalble<null>('reveal_tasks');
  }

  recieveCommunication(): Observable<Communication> {
    return this.createObservalble<Communication>('communicate');
  }
}
