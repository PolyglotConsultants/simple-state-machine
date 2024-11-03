import { Command } from './command'; // Adjust the path if necessary
import { StateKey } from './state-key'; // Adjust the path if necessary

/**
 * Interface representing the parameters for the UpdateStateCommand.
 *
 * @template T - The type of the value associated with the StateKey.
 */
export interface UpdateStateParam<T> {
    stateKey: StateKey<T>;
    value: T;
}

/**
 * A command to update the state in the StateMachine with a given value.
 * This command takes parameters containing a StateKey and a value of the generic type T
 * and updates the state using the putState method.
 *
 * @template T - The type of the value associated with the StateKey.
 */
export class UpdateStateCommand<T> extends Command<UpdateStateParam<T>> {

    /**
     * Executes the command to update the state in the StateMachine by calling the putState method
     * available to the command objects, to update the state with the provided key and value.
     *
     * @param {UpdateStateParam<T>} params - The parameters containing the state key and value.
     * @returns {void}
     */
    public execute(params:UpdateStateParam<T>): void {
        this.putState(params.stateKey, params.value);
    }
}
