import React, { type ReactElement } from "react";
import { Async } from "./Async";
import { Sync } from "./Sync";
import type { Props } from "./types";
import { isChoicesSync } from "./utils";

export const Select = (props: Props): ReactElement => {
  if (isChoicesSync(props.choices)) {
    return (
      <>
        {props.label}
        <Sync {...props} choices={props.choices} />
      </>
    );
  } else {
    return (
      <>
        {props.label}
        <Async {...props} choices={props.choices} />
      </>
    );
  }
};
