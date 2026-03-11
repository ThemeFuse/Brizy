export class ComponentTypes {
  private components = new Set<string>();

  set(key: string): void {
    this.components.add(key);
  }

  getAll(): Array<string> {
    const components: Array<string> = [];

    for (const componentType of this.components.values()) {
      components.push(componentType);
    }

    return components;
  }

  purge(): void {
    this.components.clear();
  }
}
