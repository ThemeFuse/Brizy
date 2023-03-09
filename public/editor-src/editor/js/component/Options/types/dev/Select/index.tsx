import React, { FC } from "react";
import { Props } from "./types";
import { Sync } from "./Sync";
import { Async } from "./Async";
import { isChoicesSync } from "./utils";

export const Select: FC<Props> = props => {
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
