// Define a StateKey class with a generic type T for the type of value stored against this key.
export class StateKey<T> {
  constructor(public readonly name: string) {}
}
