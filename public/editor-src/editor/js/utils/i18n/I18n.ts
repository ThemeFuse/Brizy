export interface I18nConfig {
  resources: Record<string, string>;
}

export class Dictionary {
  private resources: Record<string, string>;

  constructor(resources: Record<string, string>) {
    this.resources = resources;
  }

  t = (key: string) => {
    return this.resources[key] ?? key;
  };

  public update(resources: Record<string, string>) {
    this.resources = resources;
  }
}

export class I18n {
  static instance: Dictionary;
  private dictionary: Dictionary;

  constructor(config: I18nConfig) {
    this.dictionary = new Dictionary(config.resources);
    I18n.instance = this.dictionary;
  }

  // Pubic API
  static init(config: I18nConfig) {
    if (I18n.instance) {
      return I18n.instance;
    }

    const instance = new Dictionary(config.resources);
    I18n.instance = instance;
    return instance;
  }

  static update(config: I18nConfig): void {
    I18n.instance.update(config.resources);
  }

  static t(key: string): string {
    if (!I18n.instance) {
      // eslint-disable-next-line no-console
      console.warn("Missing I18n Initialization");
      return key;
    }

    return I18n.instance.t(key);
  }

  update(config: I18nConfig): void {
    this.dictionary = new Dictionary(config.resources);
  }
}
