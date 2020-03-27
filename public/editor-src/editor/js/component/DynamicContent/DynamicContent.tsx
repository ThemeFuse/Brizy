import React from "react";
import { useDynamicContent, DynamicContentState } from "./useDynamicContent";

type Props = {
  placeholder: string;
  delayMs: number;
  children: (state: DynamicContentState) => React.ReactElement;
};
export const DynamicContent: React.FC<Props> = ({
  placeholder,
  delayMs = 0,
  children
}) => {
  const dcData = useDynamicContent(placeholder, delayMs);

  return children(dcData);
};
