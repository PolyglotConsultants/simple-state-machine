"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateHolder = void 0;
const rxjs_1 = require("rxjs");
/**
 * The StateHolder class follows the Singleton pattern and serves as the central repository
 * for managing application state. It stores state values in a Map and provides mechanisms
 * for putting values, observing changes, and retrieving the latest state values.
 */
class StateHolder {
    constructor() {
        // map storing state keys and their associated BehaviorSubjects.
        this.stateMap = new Map();
    }
    static getInstance() {
        if (!StateHolder.instance) {
            StateHolder.instance = new StateHolder();
        }
        return StateHolder.instance;
    }
    /**
     * Puts a value into the state associated with the given key. If the key does not already exist
     * in the stateMap, a new BehaviorSubject is created for it.
     * If the key exists, the value is set as the next value in the BehaviourSubject.
     *
     * @template T The type of the value to store.
     * @param key The StateKey associated with the state value.
     * @param value The value to store in the state.
     */
    put(key, value) {
        if (!this.stateMap.has(key.name)) {
            this.stateMap.set(key.name, new rxjs_1.BehaviorSubject(value));
        }
        else {
            this.stateMap.get(key.name).next(value);
        }
    }
    /**
     * Return an Observable for the provided key. If the state for the key doesn't exist,
     * a new BehaviorSubject with an initial value of undefined is created.
     * Subscribers will be notified when the state value is updated.
     *
     * @template T The type of the state value to observe.
     * @param key The StateKey associated with the state.
     * @returns An Observable that emits state updates.
     */
    observe(key) {
        if (!this.stateMap.has(key.name)) {
            this.stateMap.set(key.name, new rxjs_1.BehaviorSubject(undefined));
        }
        return this.stateMap.get(key.name);
    }
    /**
     * Retrieves the latest value of the state for the provided key.
     *
     * @template T The type of the state value.
     * @param key The StateKey associated with the state.
     * @returns The latest value from the state or undefined if the state doesn't exist.
     */
    getLatest(key) {
        var _a;
        return (_a = this.stateMap.get(key.name)) === null || _a === void 0 ? void 0 : _a.getValue();
    }
}
exports.StateHolder = StateHolder;
