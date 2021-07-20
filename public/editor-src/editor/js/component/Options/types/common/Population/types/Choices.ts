export interface Choices<T extends string | number> {
  value: T;
  title: string;
  icon?: string;
}

export interface OptGroup<T extends string | number> {
  title: string;
  icon?: string;
  optgroup: Choices<T>[];
}
