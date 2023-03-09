import React, { FC } from "react";
import { isChoicesSync } from "./utils";
import { Props } from "./types";
import { Sync } from "./Sync";
import { Async } from "./Async";

export const MultiSelect: FC<Props> = props => {
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
