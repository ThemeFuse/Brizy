import classNames from "classnames";
import React from "react";
import { Props } from "./types/Props";
import { FCC } from "visual/utils/react/types";

export * from "./types/Props";

export const ImageUpload: FCC<Props> = ({ children, onChange, className }) => {
  return (
    <label
      className={classNames("brz-ed-control__imageUpload", className)}
      onClick={onChange}
    >
      {children}
    </label>
  );
};
