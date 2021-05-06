import React from "react";
import { useDC, State as UseDynamicContentState } from "./useDC";

type Props = {
  placeholder: string;
  delayMs: number;
  children: (state: UseDynamicContentState) => React.ReactElement;
};
export const DynamicContent: React.FC<Props> = ({
  placeholder,
  delayMs = 0,
  children
}) => {
  const dcData = useDC(placeholder, delayMs);

  return children(dcData);
};
