# Simple State Machine

[![npm version](https://badge.fury.io/js/@state-management%2Fsimple-state-machine.svg)](https://www.npmjs.com/package/@state-management/simple-state-machine)
[![Build Status](https://github.com/state-management/simple-state-machine/simple-state-machine/actions/workflows/build.yml/badge.svg)](https://github.com/state-management/simple-state-machine/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A lightweight and flexible state management library designed from scratch in Typescript, for modern JavaScript and TypeScript applications. 
The `simple-state-machine` follows a command-based architecture, making it easy to manage and manipulate application state in a structured manner.


## Features

- **Command Pattern**: Encapsulate state-changing logic in isolated, testable command objects.
- **Singleton State Management**: Centralize application state with a singleton pattern for easy access and management.
- **Type-Safe API**: Leverages TypeScript for strong typing and compile-time safety.
- **Observable State**: Integrates with observables for state subscription and reactivity.
- **Framework-Agnostic**: Works seamlessly with React, Angular, Node.js, or plain JavaScript.


## Installation

Install the library via npm:

```bash
npm install @state-management/simple-state-machine
```
OR
```bash
yarn add @state-management/simple-state-machine
```

### For Angular Applications

For Angular applications use the Angular wrapper which provides it as an injectable module:

```bash
npm install @state-management/ngx-state-machine
```
OR
```bash
yarn add @state-management/ngx-state-machine
```

### For ReactJs and React Native Applications

For react and react native applications use the react wrapper which provides it react hooks:

```bash
npm install @state-management/state-machine-react
```
OR
```bash
yarn add @state-management/state-machine-react
```


## Usage

### StateKeys.constants.ts
A sample constants file for all state keys,
```bash
import { StateKey } from '@state-management/simple-state-machine';

# NOTE: the generics in the StateKey defines the data type of the value stored against this key.
export const CounterKey = new StateKey<number>('Counter');
```

### IncrementCounterCommand.ts 
A sample Command class, contains application logic, and it updates the state with output.
```bash
import { Command } from '@state-management/simple-state-machine';
import { CounterKey } from './StateKeys.constants';

# NOTE: the generics "<number>" here defines the data type of the execution context, that is the parameter passed to the "execute" method.
export class IncrementCounterCommand extends Command<number> {
  execute(incrementBy:number): void {
    const currentValue = this.getLatest(CounterKey) || 0;
    
    # NOTE: ONLY command can call "putState" to modify the state.
    # The data type of the value must match the generics of the Key.       
    this.putState(CounterKey, currentValue + incrementBy);
  }
}
```

### Usage in application - Dispatch Command and Change State
```bash
import { StateMachine } from '@state-management/simple-state-machine';

const stateMachine = StateMachine.getInstance();

# dispatch the command object along with the parameter object it operates on, 
# in this case its a number.  The datatype of the parameter must match the generics of the Command class.
stateMachine.dispatch(new IncrementCounterCommand(1));

```

### Usage in application - Observe state change
```bash
import { StateMachine } from '@state-management/simple-state-machine';
import { CounterKey } from './pathTo/StateKeys.constants';

const stateMachine = StateMachine.getInstance();

stateMachine.onChange(CounterKey, value => {
  console.log(value);
});
```

### Usage in application - Quick state change
Quickly update state without creating a new Command Object.
```bash
import { StateMachine, UpdateStateCommand} from '@state-management/simple-state-machine';
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


# API Documentation

This section provides detailed documentation for the core classes in the `@state-management/simple-state-machine` library: `Command` and `StateMachine`.

---

## `Command<P>` Class

The `Command` class is an abstract base class that encapsulates business logic to interact with and modify the global state. 
It uses the **Command Pattern** to separate application logic from state management.  
You will be extending this class to create multiple commands to be dispatched using StateMachine.  
The generics `<P>` defines the data type of the execution context, the parameter to the command's "execute" method.

### Constructor

#### `constructor(executionContext: P)`
Initializes a new `Command` instance with the provided execution context.

| Parameter          | Type   | Description                                                                                                           |
|--------------------|--------|-----------------------------------------------------------------------------------------------------------------------|
| `executionContext` | `P`    | The parameter required for executing the command.  The type of parameter is generic, `<P>` is defined at class level. |

---

### Methods

#### `protected putState<T>(key: StateKey<T>, value: T): void`
Stores a value in the global state and makes it observable.

| Parameter | Type            | Description                                         |
|-----------|-----------------|-----------------------------------------------------|
| `key`     | `StateKey<T>`   | The key associated with the state value.            |
| `value`   | `T`             | The value to store in the state.                    |

---

#### `getLatest<T>(key: StateKey<T>): T | undefined`
Retrieves the latest value associated with the given key from the global state.

| Parameter | Type            | Description                        |
|-----------|-----------------|------------------------------------|
| `key`     | `StateKey<T>`   | The key associated with the state. |

| Returns | Type            | Description                                  |
|---------|-----------------|----------------------------------------------|
| `T`     | `T \| undefined`| The latest state value or `undefined`.      |


```typescript
// you can write the following inside a command class.
const value = this.getLatest(someKey);
console.log('Latest value:', value);
```

---

#### `abstract execute(executionContext: P): void`
Defines the application logic for the command. This method must be implemented in subclasses.
This method is called by the StateMachine when you dispatch a command.  
It would perform the application logic and will set/change the state.

| Parameter          | Type   | Description                                                                                                          |
|--------------------|--------|----------------------------------------------------------------------------------------------------------------------|
| `executionContext` | `P`    | The parameter required for executing the command. The type of parameter is generic, `<P>` is defined at class level. |

---

## `StateMachine` Class

The `StateMachine` class provides the core API for managing global state. It follows the **Singleton Pattern** and offers methods to dispatch commands and observe or retrieve state values.

### Static Methods

#### `static getInstance(): StateMachine`
Retrieves the singleton instance of the `StateMachine`. You can use this to dispatch commands and to observe state changes.

| Returns | Type         | Description                      |
|---------|--------------|----------------------------------|
| `StateMachine` | The singleton instance of `StateMachine`. |

---

### Methods

#### `dispatch<T>(command: Command<T>): void`
Executes the `Command`, invoking its `execute` method. This is the only way to modify the global state.

| Parameter | Type         | Description                                                        |
|-----------|--------------|--------------------------------------------------------------------|
| `command` | `Command<T>` | The command to be executed, encapsulating the application logic.   |

**Example**:
```typescript
import { StateMachine } from '@state-management/simple-state-machinee';
import { IncrementCounterCommand } from './commands/incrementCounterCommand';

const stateMachine = StateMachine.getInstance();
stateMachine.dispatch(new IncrementCounterCommand(1));
```
---

#### `onChange<T>(key: StateKey<T>, onChange: (value: T) => void): Subscription`
Convenience method to subscribe to changes for a specific state key. 
It triggers the `onChange` callback whenever the value associated with the state key changes.  
This method can be used even if the key does not yet exist in the state.

| Parameter  | Type                  | Description                                                  |
|------------|-----------------------|--------------------------------------------------------------|
| `key`      | `StateKey<T>`         | The key associated with the state.                           |
| `onChange` | `(value: T) => void`  | Callback function that gets triggered when the state changes.|

| Returns    | Type                  | Description                                                  |
|------------|-----------------------|--------------------------------------------------------------|
| `Subscription` | A subscription to manage the observer lifecycle. Use `unsubscribe()` to stop observing. |

**Example**:
```typescript
import { StateMachine, StateKey } from '@state-management/simple-state-machine';

const CounterKey = new StateKey<number>('counter');
const stateMachine = StateMachine.getInstance();

const subscription = stateMachine.onChange(CounterKey, (newValue) => {
    console.log('Counter updated:', newValue);
});

// to stop observing
subscription.unsubscribe();
```
---

#### `observe<T>(key: StateKey<T>): Observable<T>`
Returns an `Observable` to observe changes to the value associated with the given `key`. This method can be used even if the key does not yet exist in the state.

| Parameter | Type           | Description                          |
|-----------|----------------|--------------------------------------|
| `key`     | `StateKey<T>`  | The key associated with the state.   |

| Returns | Type          | Description                        |
|---------|---------------|------------------------------------|
| `Observable<T>` | Emits state updates for the given key. |

**Example**:
```typescript
const subscription = stateMachine.observe(someKey).subscribe((value) => {
    console.log('State updated:', value);
});
subscription.unsubscribe();
```

---

## UpdateStateCommand Class
### `UpdateStateCommand<T> extends Command<UpdateStateParam<T>> `
- Convenience class to quickly update the state without creating a new command object.
- It can be used for one-off initialization of state or a one-off state change.
- 

**Example**:
```typescript
stateMachine.dispatch(new UpdateStateCommand({stateKey: CounterKey, value: 0}));
```

###### Note: For easy tracing and debugging, do not re-use the same command class to make state changes from different parts of the application.
In this example the initial value of the "CounterKey" in this example can be set from, say 
- Application load
- Click of a reset button.

It is recommended that, for both scenarios, use a different command object, which can call
the same "service" class containing the logic to set the initial value.

---
