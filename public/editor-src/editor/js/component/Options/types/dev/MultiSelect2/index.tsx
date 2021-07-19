import React, { FC } from "react";
import {
  getModel,
  getElementModel,
  DEFAULT_VALUE,
  isChoicesSync
} from "./utils";
import { Props, StaticProps } from "./types";
import { Sync } from "./Sync";
import { Async } from "./Async";

export const MultiSelect: FC<Props> & StaticProps = props => {
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
MultiSelect.getModel = getModel;
MultiSelect.getElementModel = getElementModel;
MultiSelect.defaultValue = DEFAULT_VALUE;
