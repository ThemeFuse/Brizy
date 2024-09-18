import classnames from "classnames";
import { CheckGroupEdit } from "./types";
import { FCC } from "visual/utils/react/types";
import React from "react";

export const CheckGroupItemEditor: FCC<CheckGroupEdit> = ({
  active,
  className: _className,
  children,
  value,
  name,
  renderIcons,
  onClick
}) => {
  const className = classnames({ active }, _className);

  return (
    <div className={className} onClick={onClick}>
      {typeof renderIcons === "function" && renderIcons({ active })}
      {children}
      <input className="brz-input" type="hidden" name={name} value={value} />
    </div>
  );
};
