import React, { FC } from "react";
import { Props, StaticProps } from "./types";
import { Sync } from "./Sync";
import { Async } from "./Async";
import {
  getModel,
  getElementModel,
  defaultValue,
  isChoicesSync
} from "./utils";

export const Select: FC<Props> & StaticProps = props => {
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
Select.fromElementModel = getModel;
Select.toElementModel = getElementModel;
Select.defaultValue = defaultValue;
