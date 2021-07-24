import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../types/game';

@Pipe({
  name: 'playerTaskList',
})
export class PlayerTaskListPipe implements PipeTransform {
  transform(value: Player | undefined): string {
    return `player-${value?.playerPosition}-tasks`;
  }
}
