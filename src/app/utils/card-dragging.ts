import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';

export const handleCardDropEvent = <T>(event: CdkDragDrop<T[]>): void => {
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
