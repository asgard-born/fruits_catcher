export class ReactiveProperty<T> {
  private _value: T;
  private listeners: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this._value = initialValue;
  }

  get value(): T {
    return this._value;
  }

  set value(newValue: T) {
    if (this._value === newValue) return;
    this._value = newValue;
    this.emit(newValue);
  }

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    listener(this._value);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private emit(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}
