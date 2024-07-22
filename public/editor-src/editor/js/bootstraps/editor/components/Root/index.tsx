import { ReactElement, useEffect } from "react";

export interface Props {
  children: ReactElement;
  onRender: VoidFunction;
}

export const Root = (props: Props): ReactElement => {
  const { onRender, children } = props;
  useEffect(onRender, [onRender]);
  return children;
};
