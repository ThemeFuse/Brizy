import React, { ReactElement } from "react";
import { Props } from "./types";

export const Gap = (props: Props): ReactElement => {
  const { className } = props;

  return <div className={className} />;
};
