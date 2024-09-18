export interface WithValue {
  name: string;
  type: string;
  filename?: string;
}

export type Value = undefined | WithValue;
