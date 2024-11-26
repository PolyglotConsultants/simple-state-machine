"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStateCommand = void 0;
const command_1 = require("./command"); // Adjust the path if necessary
/**
 * A command to update the state in the StateMachine with a given value.
 * This command takes parameters containing a StateKey and a value of the generic type T
 * and updates the state using the putState method.
 *
 * @template T - The type of the value associated with the StateKey.
 */
class UpdateStateCommand extends command_1.Command {
    /**
     * Executes the command to update the state in the StateMachine by calling the putState method
     * available to the command objects, to update the state with the provided key and value.
     *
     * @param {UpdateStateParam<T>} params - The parameters containing the state key and value.
     * @returns {void}
     */
    execute(params) {
        this.putState(params.stateKey, params.value);
    }
}
exports.UpdateStateCommand = UpdateStateCommand;