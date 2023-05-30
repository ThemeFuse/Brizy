import classNames from "classnames";
import React, { FC } from "react";
import { Props } from "./types";

export * from "./types";

export const ImageUpload: FC<Props> = ({ children, onChange, className }) => {
  const _className = classNames("brz-ed-control__imageUpload", className);

  return (
    <label className={_className} onClick={onChange}>
      {children}
    </label>
  );
};
