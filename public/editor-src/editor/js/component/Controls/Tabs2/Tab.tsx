import React, { FC, PropsWithChildren } from "react";
import { WithClassName, WithValue } from "visual/utils/options/attributes";
import { Literal } from "visual/utils/types/Literal";

export type Props = WithClassName &
  WithValue<Literal> &
  PropsWithChildren<{}> & {
    title?: string;
    label?: string;
    icon?: string;
  };

export const Tab: FC<Props> = ({ children }) => {
  return <>{children}</>;
};
