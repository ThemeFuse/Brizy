import { ReactElement } from "react";
import { DCApiProxy } from "./DCApiProxy";
import { State as UseDynamicContentState, useDC } from "./useDC";

type Props = {
  placeholder: string;
  delayMs: number;
  children: (state: UseDynamicContentState) => ReactElement;
  fetcher?: DCApiProxy;
};
export const DynamicContent = ({
  placeholder,
  delayMs = 0,
  children,
  fetcher
}: Props): ReactElement => {
  const dcData = useDC(placeholder, delayMs, fetcher);

  return children(dcData);
};
