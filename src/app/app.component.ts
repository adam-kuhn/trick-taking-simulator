import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'trick-taking-simulator';
  inGame = false;

  joinGame() {
    this.inGame = true;
  }
}
