interface Choices {
  title: string;
  value: string;
}

export interface Props {
  className?: string;
  value: string;
  choices: Array<Choices>;
  onChange: (v: string) => void;
}
