import React, { ReactElement } from "react";
import { Props } from "./types";

export const ElementGridAreaSimulator = ({ style }: Props): ReactElement => {
  return (
    <div
      className="relative -m-[3px] z-[999] border-[4px] border-solid border-element-border"
      style={style}
    />
  );
};
