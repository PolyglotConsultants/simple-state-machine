"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateKey = void 0;
// Define a StateKey class with a generic type T for the type of value stored against this key.
class StateKey {
    constructor(name) {
        this.name = name;
    }
}
exports.StateKey = StateKey;
