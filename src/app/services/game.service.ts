import { io } from 'socket.io-client/build/index';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { PlayerCard, TaskCard, GameState, InitialTasks } from '../types/game';
import { TaskOptions } from '../deal-task-dialog/deal-task-dialog.component';
import { environment } from '../../environments/environment';

@Injectable()
export class GameService {
  private socket = io(environment.ws_url);
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

  recieveTaskCards(): Observable<InitialTasks> {
    const observable = new Observable<InitialTasks>((observer) => {
      this.socket.on('show_task_cards', (data: InitialTasks) => {
        observer.next(data);
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }

  recieveAssignedTask(): Observable<TaskCard> {
    return this.createObservalble<TaskCard>('assign_task');
  }

  recieveCompletedTask(): Observable<TaskCard> {
    return this.createObservalble<TaskCard>('complete_task');
  }
}
