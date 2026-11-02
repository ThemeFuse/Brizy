import classNames from "classnames";
import React from "react";
import { Toggle as Control } from "visual/component/Controls/Toggle";
import type { Props } from "visual/component/Controls/Toggle/types";
import type { Literal } from "visual/utils/types/Literal";

export const Toggle = <T extends Literal>({
  className,
  choices,
  value,
  onChange,
  label
}: Props<T>): JSX.Element => {
  const _className = classNames("brz-ed-option__toggle", className);

  return (
    <Control<T>
      choices={choices}
      value={value}
      onChange={onChange}
      className={_className}
      label={label}
    />
  );
};
