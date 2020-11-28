import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  // getting a compile error about connect not being a function
  // not breaking anything at the moment
  private socket = io.connect(environment.ws_url);

  messageRecieved(): Observable<string> {
    const observable = new Observable<string>((observer) => {
      this.socket.on('broadcast_message', (data: string) => {
        observer.next(data);
        // disconnect the socket in case of error
        return () => this.socket.disconnect();
      });
    });
    return observable;
  }
  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }
}
