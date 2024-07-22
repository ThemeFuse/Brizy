import { ReactElement } from "react";
import { useDC, State as UseDynamicContentState } from "./useDC";

type Props = {
  placeholder: string;
  delayMs: number;
  children: (state: UseDynamicContentState) => ReactElement;
};
export const DynamicContent = ({
  placeholder,
  delayMs = 0,
  children
}: Props): ReactElement => {
  const dcData = useDC(placeholder, delayMs);

  return children(dcData);
};
