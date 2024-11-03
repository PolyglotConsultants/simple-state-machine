import {Command} from '../src/command';
import {StateKey} from '../src/state-key';
import {StateMachine} from "../src/state-machine";

interface IncrementParam {
  incrementBy: number;
}

class IncrementCommand extends Command<IncrementParam> {
  public counterKey = new StateKey<number>('counter');

  execute(param: IncrementParam) {
    const currentValue = this.getLatest(this.counterKey) || 0 ;
    const newValue = currentValue + param.incrementBy;
    this.putState(this.counterKey, newValue);
  }
}

describe('test state machine with command', () => {
  let stateMachine: StateMachine = StateMachine.getInstance();

  beforeEach(() => {
    // no op;
  });

  it('should increment state by given value', (done) => {
    let incrementCommand = new IncrementCommand({ incrementBy: 5 });
    stateMachine.dispatch(incrementCommand);
    stateMachine.onChange(incrementCommand.counterKey,(value) => {
      expect(value).toBe(5);
      done();
    });
  });

});
