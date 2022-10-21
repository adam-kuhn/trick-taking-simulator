import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.sass'],
})
export class SnackbarComponent {
  message: string;
  success: boolean;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; success: boolean }
  ) {
    this.message = data.message;
    this.success = data.success;
  }
}
