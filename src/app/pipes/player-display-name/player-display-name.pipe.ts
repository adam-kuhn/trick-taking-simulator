import { Pipe, PipeTransform } from '@angular/core';
import { PlayerCard, Player } from '../../types/game';
@Pipe({
  name: 'playerDisplayName',
})
export class PlayerDisplayNamePipe implements PipeTransform {
  transform(value: PlayerCard | Player): string {
    return value.username ? value.username : `Player ${value.playerPosition}`;
  }
}
