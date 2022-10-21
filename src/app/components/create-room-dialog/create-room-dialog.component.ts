import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.sass'],
})
export class CreateRoomDialogComponent {
  createRoom = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.pattern('(?=[^a-zA-Z0-9]*[a-zA-Z0-9])[a-zA-Z0-9\\s]*'),
    ]),
    code: new FormControl('', [
      Validators.required,
      Validators.minLength(4),
      Validators.pattern('(?=[^a-zA-Z0-9]*[a-zA-Z0-9])[a-zA-Z0-9\\s]*'),
    ]),
  });

  get name(): AbstractControl | null {
    return this.createRoom.get('name');
  }
  get code(): AbstractControl | null {
    return this.createRoom.get('code');
  }
}
