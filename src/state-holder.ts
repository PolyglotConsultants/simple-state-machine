import {BehaviorSubject, Observable} from 'rxjs';
import {StateKey} from './state-key';

/**
 * The StateHolder class follows the Singleton pattern and serves as the central repository
 * for managing application state. It stores state values in a Map and provides mechanisms
 * for putting values, observing changes, and retrieving the latest state values.
 */
export class StateHolder {
  private static instance: StateHolder;

  // map storing state keys and their associated BehaviorSubjects.
  private stateMap = new Map<string, BehaviorSubject<any>>();

  private constructor() {}

  static getInstance(): StateHolder {
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
  public put<T>(key: StateKey<T>, value: T): void {
    if (!this.stateMap.has(key.name)) {
      this.stateMap.set(key.name, new BehaviorSubject<T>(value));
    } else {
      (this.stateMap.get(key.name) as BehaviorSubject<T>).next(value);
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
  public observe<T>(key: StateKey<T>): Observable<T> {
    if (!this.stateMap.has(key.name)) {
      this.stateMap.set(key.name, new BehaviorSubject<T | undefined>(undefined));
    }
    return this.stateMap.get(key.name) as Observable<T>;
  }

  /**
   * Retrieves the latest value of the state for the provided key.
   *
   * @template T The type of the state value.
   * @param key The StateKey associated with the state.
   * @returns The latest value from the state or undefined if the state doesn't exist.
   */
  public getLatest<T>(key: StateKey<T>): T | undefined {
    return this.stateMap.get(key.name)?.getValue() as T | undefined;
  }
}
