export class Subject<T> {
  private listeners: ((value: T) => void)[] = [];

  subscribe(listener: (value: T) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  next(value: T) {
    for (const listener of this.listeners) {
      listener(value);
    }
  }
}