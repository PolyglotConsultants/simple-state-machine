# Simple State Machine

[![npm version](https://badge.fury.io/js/simple-state-machine.svg)](https://www.npmjs.com/package/simple-state-machine)
[![Build Status](https://github.com/your-username/simple-state-machine/actions/workflows/build.yml/badge.svg)](https://github.com/your-username/simple-state-machine/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A lightweight and flexible state management library designed for modern JavaScript and TypeScript applications. 
The `simple-state-machine` follows a command-based architecture, making it easy to manage and manipulate application state in a structured manner.

---

## Features

- **Command Pattern**: Encapsulate state-changing logic in isolated, testable command objects.
- **Singleton State Management**: Centralize application state with a singleton pattern for easy access and management.
- **Type-Safe API**: Leverages TypeScript for strong typing and compile-time safety.
- **Observable State**: Integrates with observables for state subscription and reactivity.
- **Framework-Agnostic**: Works seamlessly with React, Angular, Node.js, or plain JavaScript.

---

## Installation

Install the library via npm:

```bash
npm install simple-state-machine
```
OR
```bash
yarn add simple-state-machine
```

### For Angular Applications

For Angular applications use the Angular wrapper which provides it as an injectable module:

```bash
npm install ngx-state-machine
```
OR
```bash
yarn add ngx-state-machine
```

### For ReactJs and React Native Applications

For react and react native applications use the react wrapper which provides it react hooks:

```bash
npm install state-machine-react
```
OR
```bash
yarn add state-machine-react
```


---
## Usage

#### StateKeys.constants.ts - A sample constants file for all state keys,
```bash

import { StateKey } from 'simple-state-machine';

export const CounterKey = new StateKey<number>('Counter');
```

#### IncrementCounterCommand.ts 
A sample Command class containing application logic, and updates state.
```bash

import { Command } from 'simple-state-machine';
import { CounterKey } from './stateKeys';

export class IncrementCounterCommand extends Command<number> {
  execute(): void {
    const currentValue = this.getLatest(CounterKey) || 0;
    
    # NOTE: ONLY command can call "putState" to modify the state.    
    this.putState(CounterKey, currentValue + this.executionParam);
  }
}
```

#### Usage in application - dispatching the command
```bash
import { StateMachine } from 'simple-state-machine';

const stateMachine = StateMachine.getInstance();

# dispatch the command object along with the parameter object it operates on, 
# in this case its a number 
stateMachine.dispatch(new IncrementCounterCommand(1));

```

#### Usage in application - listening to state changes
```bash
import { StateMachine } from 'simple-state-machine';
import { CounterKey } from './pathTo/StateKeys.constants';

const stateMachine = StateMachine.getInstance();

stateMachine.onChange(CounterKey, value => {
  console.log(value);
});
```

#### Usage in application -  Quickly update state without creating a new Command Object.
```bash
import { StateMachine, UpdateStateCommand} from 'simple-state-machine';
import { CounterKey } from './pathTo/StateKeys.constants';

const stateMachine = StateMachine.getInstance();

# set the initial value of the counter.
stateMachine.dispatch(new UpdateStateCommand({stateKey: CounterKey, value: 0}));

# Please Note:  For easy tracing and debugging it is recommended, NOT to re-use a command class.
# For example the initial value of the "CounterKey" in this example can be set from, say 
#   a. application load
#   b. click of a reset button.
# It is recommended that, for both scenarios, use a different command object, which can call 
# the same "service" class containing the logic to set the initial value
```

---
## API Documentation

### `StateMachine`
- **`dispatch(command: Command<any>): void`**
  Executes a command and updates state.

- **`observe<T>(key: StateKey<T>): Observable<T>`**
  Subscribes to changes for a specific state key.

- **`getLatest<T>(key: StateKey<T>): T | undefined`**
  Retrieves the latest value for a state key.

### `Command<T>`
- **`constructor(executionParam: T)`**
  Initializes a command with its execution parameter.

- **`execute(): void`**
  Abstract method for implementing command logic.

### `UpdateStateCommand<T> extends Command<UpdateStateParam<T>> `
- Convenience class to quickly update the state without creating a new command object.
- It can be used for one-off initialization of state or a one-off state change.
- For easy tracing and debugging, it is recommended, NOT to re-use the same command class to make state changes from different parts of the application.
