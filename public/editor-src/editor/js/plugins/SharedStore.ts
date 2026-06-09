export interface ISharedStore {
  get(key: string): unknown | undefined;
  set(key: string, value: unknown): void;
  delete(key: string): boolean;
  clear(): void;
}

export class SharedStore implements ISharedStore {
  private readonly map = new Map<string, unknown>();

  get(key: string): unknown | undefined {
    return this.map.get(key);
  }
  set(key: string, value: unknown): void {
    this.map.set(key, value);
  }
  delete(key: string): boolean {
    return this.map.delete(key);
  }
  clear(): void {
    this.map.clear();
  }
}
