import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { PlayerCard } from '../types/game';

@Injectable({ providedIn: 'root' })
export class GameSummaryService {
  private readonly _winningCard = new BehaviorSubject<PlayerCard | null>(null);
  readonly winningCard$ = this._winningCard.asObservable();

  getWinningCard(): PlayerCard | null {
    return this._winningCard.getValue();
  }

  setWinningCard(card: PlayerCard | null): void {
    this._winningCard.next(card);
  }
}
