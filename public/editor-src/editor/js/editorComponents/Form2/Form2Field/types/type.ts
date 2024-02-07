export type Active = Record<string, boolean>;

export interface RadioProps {
  options: string[];
  label: string;
  attr: {
    name: string;
  };
}

export interface RadioState {
  value: string;
}

export interface CheckboxProps {
  onChange: (data: { active: Active }) => void;
  options: string[];
  active: Active;
  label: string;
  _id: string;
  index: number;
  attr: {
    type: string;
  };
}

export interface CheckboxState {
  value: string;
}
