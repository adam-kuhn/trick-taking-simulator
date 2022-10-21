import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.sass'],
})
export class SnackbarComponent {
  @Input() message = '';
  @Input() success = false;
}
