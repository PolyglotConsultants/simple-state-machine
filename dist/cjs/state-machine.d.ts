import { StateKey } from "./state-key";
import { Observable, Subscription } from "rxjs";
import { Command } from "./command";
/**
 * The StateMachine  follows the Singleton pattern and provides the methods for command
 * execution and state observation. It acts as a central point for interacting with the global state,
 * hiding the implementation details of how the state is stored.
 * ######
 * It has the {@link observe}, {@link onChange} and {@link getLatest} to observe and/or get value from global state.
 * And it has the {@link dispatch} method that executes a command, which can modify the global state.
 */
export declare class StateMachine {
    private static instance;
    private stateHolder;
    private constructor();
    /**
     * Retrieves the singleton instance of the StateMachine. If the instance does not exist yet,
     * it is created.
     *
     * @returns The singleton instance of StateMachine.
     */
    static getInstance(): StateMachine;
    /**
     * Dispatching a {@link command} calls the {@link execute} method of the command object.  This follows the Command pattern
     * and allows commands to encapsulate application logic and modify application state as part of logic.
     *
     * #### Note:
     * Only {@link command} can modify state using the {@link putState}(key, value) method available to it.
     * ######
     *
     * @example
     * statMachine.dispatch(new DoSomethingCommand(params));
     *
     *
     * @template T The type of the execution parameter passed to the command.
     * @param command The command to be dispatched and executed.
     */
    dispatch<T>(command: Command<T>): void;
    /**
     * Returns an observable to observes changes to the value associated with the given {@link key}.
     * You can observe a key even if it does not exist in the state yet.
     *
     * #### Note:
     * For most cases you can use the {@link onChange} method.  Use this method, if you need an Observable.
     * ######
     *
     * @example
     * const subscription = stateMachine.observe(key)
     *                                  .subscribe((value) => console.log('state changed', value));
     * // NOTE: call subscription.unsubscribe();
     *
     * @template T The type of the state value to observe.
     * @param key The StateKey associated with the state.
     * @returns An Observable that emits state updates.
     */
    observe<T>(key: StateKey<T>): Observable<T>;
    /**
     * It will call the passed {@link onChange} method whenever the value associated with the passed {@link key} changes in global state.
     *
     * @example
     * const subscription = stateMachine.onChange(someKey, (value) => {
     *     console.log('state changed', value)
     * });
     * // NOTE: call subscription.unsubscribe();
     *
     * // This is a convenience method.  The longer version will be as follows
     * const subscription = stateMachine.observe(key).subscribe((value) => {
     *     console.log('state changed', value)
     * });
     * // NOTE: call subscription.unsubscribe();
     *
     * @template T The type of the state value to observe.
     * @param key The StateKey associated with the state.
     * @param onChange The callback function that will be triggered whenever the state changes.
     * @returns A Subscription object, which can be used to unsubscribe later.
     */
    onChange<T>(key: StateKey<T>, onChange: (value: T) => void): Subscription;
    /**
     * Retrieves the latest value from the state for the given key. If the state value is not available,
     * the method returns undefined.
     *
     * @template T The type of the state value.
     * @param key The StateKey associated with the state.
     * @returns The latest state value or undefined if it doesn't exist.
     */
    getLatest<T>(key: StateKey<T>): T | undefined;
}
