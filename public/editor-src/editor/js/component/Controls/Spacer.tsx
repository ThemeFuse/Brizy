import React, { ReactElement } from "react";

export interface Props {
  space: string;
}

export const Spacer = ({ space }: Props): ReactElement => {
  return <div style={{ paddingBottom: space }} />;
};
