import classNames from "classnames";
import React from "react";
import type { FCC } from "visual/utils/react/types";
import type { Props } from "./types/Props";

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
