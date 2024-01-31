export interface NumberType {
  number: number;
}

export interface VariationValue {
  title: string;
  value: number;
  onChange: (value: NumberType) => void;
  min: number;
  max: number;
}
