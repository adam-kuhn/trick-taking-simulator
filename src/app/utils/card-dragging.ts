import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { PlayerCard } from '../types/game';

export const handleCardDropEvent = (event: CdkDragDrop<PlayerCard[]>): void => {
  const {
    container: currentContainer,
    previousContainer,
    currentIndex,
    previousIndex,
  } = event;
  if (previousContainer === currentContainer) {
    moveItemInArray(currentContainer.data, previousIndex, currentIndex);
    return;
  }
  transferArrayItem(
    previousContainer.data,
    currentContainer.data,
    previousIndex,
    currentIndex
  );
};
