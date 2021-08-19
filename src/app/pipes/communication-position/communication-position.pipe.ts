import { Pipe, PipeTransform } from '@angular/core';
import { Player } from '../../types/game';

@Pipe({
  name: 'communicationPosition',
})
export class CommunicationPositionPipe implements PipeTransform {
  transform(value: Player | null): string {
    return `player-${value?.playerPosition}-communication`;
  }
}
