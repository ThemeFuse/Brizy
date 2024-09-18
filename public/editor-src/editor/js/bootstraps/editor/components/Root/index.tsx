import { useEffect } from "react";

export interface Props {
  children: JSX.Element;
  onRender: VoidFunction;
}

export const Root = (props: Props): JSX.Element => {
  const { onRender, children } = props;
  useEffect(onRender, [onRender]);
  return children;
};
