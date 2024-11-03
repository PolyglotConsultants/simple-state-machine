import { StateHolder } from '../src/state-holder';
import { StateKey } from '../src/state-key';

describe('StateHolder', () => {
  let stateHolder: StateHolder;
  const CounterKey = new StateKey<number>('counter');

  beforeEach(() => {
    stateHolder = StateHolder.getInstance();
  });

  it('should store and retrieve state', (done) => {
    stateHolder.put(CounterKey, 10);
    const state$ = stateHolder.observe(CounterKey);

    state$?.subscribe((value) => {
      expect(value).toBe(10);
      done();
    });
  });

  it('should update state', (done) => {
    stateHolder.put(CounterKey, 5);
    stateHolder.put(CounterKey, 20);
    const state$ = stateHolder.observe(CounterKey);

    state$?.subscribe((value) => {
      expect(value).toBe(20);
      done();
    });
  });
});
