import React from "react";
import { IconToggle } from "visual/component/Controls/IconToggle";
import { IconToggleItem } from "visual/component/Controls/IconToggle/IconToggleItem";
import { Props } from "./types";
import { Literal } from "visual/utils/types/Literal";
import { isNonEmptyArray } from "visual/utils/array/types";

export const Toggle = <T extends Literal>({
  className,
  choices,
  value: { value },
  onChange,
  label
}: Props<T>): JSX.Element | null => {
  const items = choices.map(({ icon, value, title }, i) => (
    <IconToggleItem<T> key={i} value={value} icon={icon} title={title} />
  ));

  return isNonEmptyArray<JSX.Element>(items) ? (
    <>
      {label}
      <IconToggle<T>
        value={value}
        onChange={(value) => onChange({ value })}
        className={className}
      >
        {items}
      </IconToggle>
    </>
  ) : null;
};
