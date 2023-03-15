export interface WithValue {
  name: string;
  type: string;
}

export type Value = undefined | WithValue;
