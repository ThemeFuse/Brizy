import classNames from "classnames";
import React, { FC } from "react";
import { Props } from "./types/Props";

export * from "./types/Props";

export const ImageUpload: FC<Props> = ({ children, onChange, className }) => {
  return (
    <label
      className={classNames("brz-ed-control__imageUpload", className)}
      onClick={onChange}
    >
      {children}
    </label>
  );
};
