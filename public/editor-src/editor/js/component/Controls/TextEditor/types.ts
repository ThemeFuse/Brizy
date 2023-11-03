export type Props = {
  value?: string;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  onChange: (v: string) => void;
};
export type DefaultProps = Omit<Required<Props>, "onChange">;
export type State = {
  value: string;
};
