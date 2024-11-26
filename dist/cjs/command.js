"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
/**
 * The StateMachine and the Command are the two classes for interacting with the Simple State Machine.
 *
 * This is an abstract base class representing a command in the system which can modify state as part of execution.
 * The Command pattern allows you to encapsulate the business logic which modifies the state and
 * separate this logic out from the rest of the code.
 *
 * @template P The type for executionContext, the execution parameter passed to the command.
 */
class Command {
    /**
     * Initializes the command with the provided execution context.
     *
     * @param executionContext The parameter required for executing the command.
     */
    constructor(executionContext) {
        this.executionContext = executionContext;
    }
    /**
     * Retrieve the current execution context.
     *
     * @returns The execution context.
     */
    getExecutionContext() {
        return this.executionContext;
    }
    /**
     * Sets the StateHolder instance that allows the command to interact with global state.
     * This is called by the StateMachine when the command is dispatched, before the execute method is called.
     *
     * @param stateHolder The StateHolder instance injected by the StateMachine.
     */
    setStateHolder(stateHolder) {
        this.stateHolder = stateHolder;
    }
    /**
     * This method allows a command to modify the state.  It stores a value in the global state and makes it "Observable".
     * Other parts of the application can observe the value stored against the key and reqct to changes to its value.
     * ######
     *
     * @example
     * // puts a key named "counter" in the global state with the value set to 0.
     * this.putState(new StateKey<number>('counter'), 0);
     *
     * // how a UI component will observe and react to the change in value
     * StateMachine.getInstance().onChange(key, newValue => doSomethingWithNewValue(newValue));
     *
     *
     * @template T The type of the value to store.
     * @param key The StateKey associated with the value.
     * @param value The value to store in the state.
     *
     */
    putState(key, value) {
        this.stateHolder.put(key, value);
    }
    /**
     * This method allows commands to access the most recent value in the state instead of observing changes to it.
     *
     * #### Note:
     * The command should avoid calling {@link StateMachine.observe} or {@link StateMachine.subscribe}
     * to avoid accidentally creating large number run away subscriptions.
     * ######
     *
     * @example
     * // get the latest value for "counter" from the global state.
     * let counter:number = this.getLatest(new StateKey<number>('counter'));
     *
     * @template T The type of the value in the state.
     * @param key The StateKey associated with the state.
     * @returns The latest value from the state or undefined if the value does not exist.
     *
     */
    getLatest(key) {
        return this.stateHolder.getLatest(key);
    }
}
exports.Command = Command;
