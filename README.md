# Simple State Machine

[![npm version](https://badge.fury.io/js/@state-management%2Fsimple-state-machine.svg)](https://www.npmjs.com/package/@state-management/simple-state-machine)
[![Build Status](https://github.com/state-management/simple-state-machine/actions/workflows/build.yml/badge.svg)](https://github.com/state-management/simple-state-machine/actions)
[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

A lightweight and flexible state management library designed from scratch in Typescript, for modern JavaScript and TypeScript applications. 
It is built around `reactive` programming (RxJs) and Command pattern.
The `simple-state-machine` decouples business logic from the UI code, as it allows state manipulation only as part of execution of logic via `Commands`.
This enables a clean, maintainable, and testable application architecture.

This project is the core library in the **state-management** suite, and it includes wrappers for popular frameworks:
- [state-machine-react](https://github.com/state-management/state-machine-react): React wrapper providing hooks like `fromState` and `useDispatcher`.
- [ngx-state-machine](https://github.com/state-management/ngx-state-machine): Angular wrapper making the state machine injectable into angular components as a service.

By combining **simple-state-machine** with these wrappers, you can seamlessly integrate state management into your preferred framework.

---

## Features

### **Traceability**: 
This **single most important feature** that we wanted to design correctly is traceability of code.
When trying to identify an issue, we should be able to go through the code, and identify the block causing the issue, without having to open ten different files.
We should be able to use the  IDE's "find references" or even the simple Find(Ctrl + F) feature to quickly identify what `StateKeys` are changed by which `Commands`.
  
This is invaluable while identifying issues in code.  This also reduces the dependency on debugging tools and time spent in debugging.
  
***Most importantly*** the state management code looks a lot less scary, it is easy to read, and it is very easy to change and unit test.  

### Rest of the Features:
- **State Management**: Centralize application state management using the Commands and Observables.
- **Command Pattern**: Encapsulate state-changing logic in isolated, testable command objects.  This allows you to `separate business logic` from UI code.
- **Type-Safe API**: Leverages TypeScript for strong typing and compile-time safety.
- **Testability**: Designed for easy testing of state-related logic.
- **Observable State**: Uses `reactive` (RxJS) for state observation and subscriptions.
- **Framework-Agnostic**: Core library in Typescript, that can be extended to React, Angular, or other frameworks.


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


## API Documentation

This section provides detailed documentation for the core classes in the `@state-management/simple-state-machine` library: `Command` and `StateMachine`.


## `Command<P>` Class

The `Command` class is an abstract base class that encapsulates business logic to interact with and modify the global state. 
It uses the **Command Pattern** to separate application logic from state management.  
You will be extending this class to create multiple commands to be dispatched using StateMachine.  
The generics `<P>` defines the data type of the execution context, the parameter to the command's "execute" method.

### Constructor

### `constructor(executionContext: P)`
Initializes a new `Command` instance with the provided execution context.

| Parameter          | Type   | Description                                                                                                           |
|--------------------|--------|-----------------------------------------------------------------------------------------------------------------------|
| `executionContext` | `P`    | The parameter required for executing the command.  The type of parameter is generic, `<P>` is defined at class level. |

---
### Methods

### `protected putState<T>(key: StateKey<T>, value: T): void`
Stores a value in the global state and makes it observable.

| Parameter | Type            | Description                                         |
|-----------|-----------------|-----------------------------------------------------|
| `key`     | `StateKey<T>`   | The key associated with the state value.            |
| `value`   | `T`             | The value to store in the state.                    |


---

### `getLatest<T>(key: StateKey<T>): T | undefined`
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

### `abstract execute(executionContext: P): void`
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

### `static getInstance(): StateMachine`
Retrieves the singleton instance of the `StateMachine`. You can use this to dispatch commands and to observe state changes.

| Returns | Type         | Description                      |
|---------|--------------|----------------------------------|
| `StateMachine` | The singleton instance of `StateMachine`. |

---

### Methods

### `dispatch<T>(command: Command<T>): void`
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

### `onChange<T>(key: StateKey<T>, onChange: (value: T) => void): Subscription`
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

### `observe<T>(key: StateKey<T>): Observable<T>`
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

## `UpdateStateCommand` Class
`UpdateStateCommand<T> extends Command<UpdateStateParam<T>> `
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



## Contributing

We welcome contributions! Please open an issue or submit a pull request if you’d like to improve the library.

### How to Contribute
#### 1. Fork the Repository:
Visit the [simple-state-machine GitHub repository](https://github.com/state-management/simple-state-machine).
Click the "Fork" button to create a copy of the repository under your GitHub account.

#### 2. Clone the Fork:
```bash
git clone https://github.com/state-management/simple-state-machine.git
cd simple-state-machine
```

#### 3. Create a Feature Branch:
```bash
git checkout -b feature/add-simple-state-machine-feature
```   

#### 4. Make Your Changes:
Add or update code, write tests, and ensure the changes are well-documented.
Run tests locally, ensure all existing and new tests pass
```bash
npm install
npm test
```   

#### 5. Commit and Push Your Changes:
Write a clear and concise commit message:
```bash
git add .
git commit -m "Add new feature to simple-state-machine"
git push origin feature/add-simple-state-machine-feature
```

#### 6. Create a Pull Request:
Go to your fork on GitHub and click the “New Pull Request” button.
Provide a description of your changes and any additional context.
