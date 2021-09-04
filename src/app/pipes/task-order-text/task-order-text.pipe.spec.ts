import { TaskOrderTextPipe } from './task-order-text.pipe';
import { Suits, TaskCard } from '../../types/game';

const taskCardFixture = (options?: Partial<TaskCard>): TaskCard => ({
  completed: false,
  username: 'joe',
  value: 1,
  suit: Suits.Green,
  playerPosition: 1,
  ...options,
});

describe('TaskOrderTextPipe', () => {
  const pipe = new TaskOrderTextPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('formats text for specific ordering', () => {
    const taskCard = taskCardFixture({ specificOrder: 3 });
    const expected = 'Third';
    const actual = pipe.transform(taskCard);
    expect(actual).toEqual(expected);
  });
  it('formats text for relative ordering', () => {
    const taskCard = taskCardFixture({ relativeOrder: 3 });
    const expected = 'Relative-III';
    const actual = pipe.transform(taskCard);
    expect(actual).toEqual(expected);
  });
  it('formats text for last task', () => {
    const taskCard = taskCardFixture({ lastTask: true });
    const expected = 'Last Task';
    const actual = pipe.transform(taskCard);
    expect(actual).toEqual(expected);
  });
  it('formats for no order', () => {
    const taskCard = taskCardFixture();
    const expected = '';
    const actual = pipe.transform(taskCard);
    expect(actual).toEqual(expected);
  });
});
